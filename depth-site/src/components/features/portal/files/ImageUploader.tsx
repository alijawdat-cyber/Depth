"use client";

import { useState, useCallback, useRef } from "react";
import { cloudflareImageUrl } from "@/lib/cloudflare-public";

type Props = { projectId: string; onUploaded: () => void };

export default function ImageUploader({ projectId, onUploaded }: Props) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [dragActive, setDragActive] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isMock, setIsMock] = useState(false);
  const lastTick = useRef<{ t: number; loaded: number } | null>(null);
  const [speedBps, setSpeedBps] = useState<number>(0);
  const [etaSec, setEtaSec] = useState<number | undefined>(undefined);

  const validateMagicBytes = async (file: File) => {
    const head = file.slice(0, 16);
    const buf = await head.arrayBuffer();
    const b = new Uint8Array(buf);
    const isJPEG = b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff;
    const isPNG = b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47;
    const isWEBP = b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x46 && b[8] === 0x57 && b[9] === 0x45 && b[10] === 0x42 && b[11] === 0x50;
    if (!(isJPEG || isPNG || isWEBP)) throw new Error("نوع صورة غير صالح");
  };

  const computeChecksumHead = async (file: File, maxBytes = 1024 * 1024): Promise<string> => {
    const slice = file.slice(0, Math.min(file.size, maxBytes));
    const buf = await slice.arrayBuffer();
    const digest = await crypto.subtle.digest('SHA-256', buf);
    const bytes = new Uint8Array(digest);
    return Array.from(bytes).map(x => x.toString(16).padStart(2, '0')).join('');
  };

  const transcodeIfNeeded = async (file: File): Promise<{ blob: Blob; contentType: string }> => {
    // Downscale/compress only if > 2MB
    if (file.size <= 2 * 1024 * 1024) return { blob: file, contentType: file.type || 'image/jpeg' };
    try {
      const bitmap = await createImageBitmap(file);
      const maxDim = 4096;
      const scale = Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height));
      const w = Math.round(bitmap.width * scale);
      const h = Math.round(bitmap.height * scale);
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (!ctx) return { blob: file, contentType: file.type || 'image/jpeg' };
      ctx.drawImage(bitmap, 0, 0, w, h);
      const outType = 'image/jpeg';
      const blob: Blob = await new Promise((resolve) => canvas.toBlob(b => resolve(b || file), outType, 0.82));
      return { blob, contentType: outType };
    } catch {
      return { blob: file, contentType: file.type || 'image/jpeg' };
    }
  };

  const uploadFile = useCallback(async (origFile: File) => {
    if (!projectId) {
      setError("لا يمكن الرفع بدون مشروع");
      return;
    }
    setBusy(true);
    setError(null);
    setSuccess(false);
    setProgress(0);
    setSpeedBps(0);
    setEtaSec(undefined);
    try {
      await validateMagicBytes(origFile);
      const checksum = await computeChecksumHead(origFile);
      const { blob, contentType: ct } = await transcodeIfNeeded(origFile);
      const file = new File([blob], origFile.name, { type: ct });
      const res = await fetch('/api/media/images/direct-upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId, contentType: ct, size: file.size })
      });
      if (!res.ok) throw new Error('failed to get upload url');
      const { uploadURL, id, warning } = await res.json();
      if (warning) setIsMock(true);

      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', uploadURL, true);
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            const now = performance.now();
            const last = lastTick.current || { t: now, loaded: 0 };
            const dt = Math.max(1, now - last.t);
            const dBytes = Math.max(0, e.loaded - last.loaded);
            const speed = (dBytes * 1000) / dt;
            setSpeedBps(speed);
            const remaining = Math.max(0, e.total - e.loaded);
            setEtaSec(speed > 0 ? Math.round(remaining / speed) : undefined);
            lastTick.current = { t: now, loaded: e.loaded };
            setProgress(Math.round((e.loaded / e.total) * 100));
          }
        };
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) resolve();
          else reject(new Error('failed to upload'));
        };
        xhr.onerror = () => reject(new Error('upload error'));
        xhr.send(file);
      });

      setPreviewId(id);

      // Save metadata so it appears in Files list (with retry & backoff)
      const url = cloudflareImageUrl(id, 'preview');
      const saveMeta = async (attempt = 1): Promise<void> => {
        const resp = await fetch('/api/portal/files', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: file.name,
            type: 'image',
            size: file.size,
            projectId,
            url,
            imageId: id,
            description: '',
            contentType: ct,
            checksum,
          })
        });
        if (!resp.ok) {
          if (attempt < 3) {
            await new Promise(r => setTimeout(r, 300 * Math.pow(2, attempt - 1)));
            return saveMeta(attempt + 1);
          }
          let reason = 'failed to save metadata';
          try { const j = await resp.json(); if (j?.error) reason = j.error; } catch {}
          throw new Error(reason);
        }
      };
      await saveMeta();

      setSuccess(true);
      onUploaded();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'failed';
      setError(msg);
    } finally {
      setBusy(false);
      setTimeout(() => setProgress(0), 1000);
    }
  }, [projectId, onUploaded]);

  const onPick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    uploadFile(file);
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };
  const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  return (
    <div className={`p-3 border rounded-[var(--radius)] bg-[var(--bg)] ${dragActive ? 'border-[var(--accent-500)]' : 'border-[var(--elev)]'}`}>
      <div className="text-sm font-medium mb-2">رفع صورة (Cloudflare Images)</div>
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={`relative flex flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed p-4 text-center ${dragActive ? 'border-[var(--accent-500)] bg-[var(--elev)]/30' : 'border-[var(--elev)] bg-[var(--bg)]'}`}
      >
        <div className="text-xs text-[var(--slate-600)]">
          اسحب وأسقط الصورة هنا أو اختر من جهازك
        </div>
        <label className="inline-flex items-center gap-2 text-[var(--accent-600)] underline cursor-pointer">
          <input type="file" accept="image/*" onChange={onPick} disabled={busy || !projectId} className="hidden" />
          اختر ملفًا
        </label>
      </div>

      {isMock && (
        <div className="mt-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded p-2">
          بيئة تجريبية: تم استخدام Mock Upload بسبب نقص إعدادات Cloudflare.
        </div>
      )}

      {busy && (
        <div className="mt-3">
          <div className="h-2 w-full bg-[var(--elev)] rounded" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}>
            <div className="h-2 bg-[var(--accent-500)] rounded transition-all" style={{ width: `${progress}%` }} />
          </div>
          <div className="text-xs text-[var(--slate-600)] mt-1" aria-live="polite">
            جاري الرفع... {progress}%{speedBps ? ` — ${formatBytes(speedBps)}/ث` : ''}{etaSec ? ` — ${formatEta(etaSec)} متبقية` : ''}
          </div>
        </div>
      )}
      {error && <div className="text-xs text-red-600 mt-2">{error}</div>}
      {success && !busy && <div className="text-xs text-green-600 mt-2">تم الرفع بنجاح</div>}
      {previewId && (
        <div className="mt-3 text-xs space-y-2">
          <div className="text-[var(--slate-600)]">imageId: {previewId}</div>
          <div className="flex items-center gap-3">
            <a className="text-[var(--accent-600)] underline" href={cloudflareImageUrl(previewId, 'thumb')} target="_blank">thumb</a>
            <a className="text-[var(--accent-600)] underline" href={cloudflareImageUrl(previewId, 'preview')} target="_blank">preview</a>
            <a className="text-[var(--accent-600)] underline" href={cloudflareImageUrl(previewId, 'hero')} target="_blank">hero</a>
          </div>
        </div>
      )}
    </div>
  );
}

function formatBytes(bytes?: number) {
  if (!bytes || bytes <= 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  let i = 0;
  let val = bytes;
  while (val >= 1024 && i < units.length - 1) { val /= 1024; i++; }
  return `${val.toFixed(1)} ${units[i]}`;
}

function formatEta(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}


