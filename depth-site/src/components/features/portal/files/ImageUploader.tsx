"use client";

import { useState, useCallback } from "react";
import { cloudflareImageUrl } from "@/lib/cloudflare-public";

type Props = { projectId: string; onUploaded: () => void };

export default function ImageUploader({ projectId, onUploaded }: Props) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [dragActive, setDragActive] = useState(false);
  const [success, setSuccess] = useState(false);

  const uploadFile = useCallback(async (file: File) => {
    if (!projectId) {
      setError("لا يمكن الرفع بدون مشروع");
      return;
    }
    setBusy(true);
    setError(null);
    setSuccess(false);
    setProgress(0);
    try {
      const ct = file.type || "image/webp";
      const res = await fetch('/api/media/images/direct-upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId, contentType: ct, size: file.size })
      });
      if (!res.ok) throw new Error('failed to get upload url');
      const { uploadURL, id } = await res.json();

      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', uploadURL, true);
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
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
            description: ''
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

      {busy && (
        <div className="mt-3">
          <div className="h-2 w-full bg-[var(--elev)] rounded">
            <div className="h-2 bg-[var(--accent-500)] rounded transition-all" style={{ width: `${progress}%` }} />
          </div>
          <div className="text-xs text-[var(--slate-600)] mt-1">جاري الرفع... {progress}%</div>
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


