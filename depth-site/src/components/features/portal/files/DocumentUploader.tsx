"use client";

import { useCallback, useState } from "react";

type Props = { projectId: string; onUploaded: () => void };

export default function DocumentUploader({ projectId, onUploaded }: Props) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [docKey, setDocKey] = useState<string | null>(null);
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
      const contentType = file.type || 'application/pdf';
      // Choose simple PUT for small files, multipart for large
      if (file.size < 32 * 1024 * 1024) {
        const res = await fetch('/api/portal/files/presign', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ filename: file.name, contentType, size: file.size, projectId })
        });
        if (!res.ok) throw new Error('failed to presign');
        const { url, key } = await res.json();
        await new Promise<void>((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.open('PUT', url, true);
          // Minimal headers: do not send x-amz-content-sha256 to match SignedHeaders=host
          xhr.setRequestHeader('Content-Type', contentType);
          xhr.upload.onprogress = (e) => {
            if (e.lengthComputable) setProgress(Math.round((e.loaded / e.total) * 100));
          };
          xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) resolve();
            else reject(new Error('failed to upload'));
          };
          xhr.onerror = () => reject(new Error('upload error'));
          xhr.send(file);
        });
        setDocKey(key);
        // Save metadata
        const saveMeta = async (attempt = 1): Promise<void> => {
          const resp = await fetch('/api/portal/files', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: file.name,
              type: 'document',
              size: file.size,
              projectId,
              url: key,
              description: '',
              contentType,
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
      } else {
        // Multipart flow
        const initRes = await fetch('/api/portal/files/multipart/init', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ filename: file.name, contentType, size: file.size, projectId })
        });
        if (!initRes.ok) throw new Error('failed to init multipart');
        const { key, uploadId } = await initRes.json();
        const partSize = 8 * 1024 * 1024; // 8MB
        const parts: { PartNumber: number; ETag: string }[] = [];
        let partNumber = 1;
        for (let offset = 0; offset < file.size; offset += partSize) {
          const chunk = file.slice(offset, Math.min(offset + partSize, file.size));
          const signRes = await fetch('/api/portal/files/multipart/part', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ key, uploadId, partNumber })
          });
          if (!signRes.ok) throw new Error('failed to sign part');
          const { url } = await signRes.json();
          const etag = await new Promise<string>((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('PUT', url, true);
            xhr.upload.onprogress = (e) => {
              if (e.lengthComputable) setProgress(Math.round((e.loaded / e.total) * 100));
            };
            xhr.onload = () => {
              if (xhr.status >= 200 && xhr.status < 300) {
                const et = xhr.getResponseHeader('ETag') || '';
                resolve(et.replaceAll('"', ''));
              } else reject(new Error('failed to upload part'));
            };
            xhr.onerror = () => reject(new Error('upload error'));
            xhr.send(chunk);
          });
          parts.push({ PartNumber: partNumber, ETag: etag });
          partNumber++;
        }
        const completeRes = await fetch('/api/portal/files/multipart/complete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key, uploadId, parts })
        });
        if (!completeRes.ok) throw new Error('failed to complete multipart');
        setDocKey(key);
        // Save metadata
        const saveMeta = async (attempt = 1): Promise<void> => {
          const resp = await fetch('/api/portal/files', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: file.name,
              type: 'document',
              size: file.size,
              projectId,
              url: key,
              description: '',
              contentType,
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
      }
      

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

  const onPick = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      <div className="text-sm font-medium mb-2">رفع ملف (R2 Documents)</div>
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={`relative flex flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed p-4 text-center ${dragActive ? 'border-[var(--accent-500)] bg-[var(--elev)]/30' : 'border-[var(--elev)] bg-[var(--bg)]'}`}
      >
        <div className="text-xs text-[var(--slate-600)]">اسحب وأسقط الملف هنا أو اختر من جهازك</div>
        <label className="inline-flex items-center gap-2 text-[var(--accent-600)] underline cursor-pointer">
          <input type="file" accept="application/pdf,application/zip" onChange={onPick} disabled={busy || !projectId} className="hidden" />
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
      {docKey && (
        <div className="mt-3 text-xs space-y-1">
          <div>key: {docKey}</div>
        </div>
      )}
    </div>
  );
}


