"use client";

import { useCallback, useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { cloudflareImageUrl, cloudflareStreamIframeUrl } from "@/lib/cloudflare-public";

type UploadKind = 'image' | 'video' | 'document';

type Props = {
  projectId: string;
  onUploaded: () => void;
  className?: string;
};

type QueueItem = {
  id: string;
  file: File;
  kind: UploadKind;
  progress: number; // 0..100
  status: 'queued' | 'uploading' | 'done' | 'error';
  error?: string;
  metaUrl?: string; // final accessible url or R2 key for documents
};

export default function UnifiedUploader({ projectId, onUploaded, className = "" }: Props) {
  const [kind, setKind] = useState<UploadKind>('image');
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [busy, setBusy] = useState(false);
  const [drag, setDrag] = useState(false);

  const acceptAttr = useMemo(() => {
    if (kind === 'image') return 'image/*';
    if (kind === 'video') return 'video/mp4';
    return 'application/pdf,application/zip';
  }, [kind]);

  const addFilesToQueue = (files: FileList | null) => {
    if (!files || !projectId) return;
    const items: QueueItem[] = Array.from(files).map((f, idx) => ({
      id: `${Date.now()}-${idx}-${Math.random().toString(36).slice(2, 8)}`,
      file: f,
      kind,
      progress: 0,
      status: 'queued',
    }));
    setQueue(prev => [...prev, ...items]);
  };

  const uploadSequential = useCallback(async () => {
    if (!projectId) return;
    if (busy) return;
    setBusy(true);
    try {
      for (let i = 0; i < queue.length; i++) {
        if (queue[i].status !== 'queued') continue;
        const qid = queue[i].id;
        // mark uploading
        setQueue(prev => prev.map(it => it.id === qid ? { ...it, status: 'uploading', progress: 0 } : it));
        const q = queue[i];
        try {
          if (q.kind === 'image') {
            const ct = q.file.type || 'image/webp';
            const res = await fetch('/api/media/images/direct-upload', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ projectId, contentType: ct, size: q.file.size })
            });
            if (!res.ok) throw new Error('failed to get upload url');
            const { uploadURL, id } = await res.json();
            await xhrUpload('POST', uploadURL, q.file, (p) => tick(qid, p));
            const url = cloudflareImageUrl(id, 'preview');
            await saveMeta(q.file.name, 'image', q.file.size, projectId, url, { imageId: id });
            setQueue(prev => prev.map(it => it.id === qid ? { ...it, status: 'done', progress: 100, metaUrl: url } : it));
          } else if (q.kind === 'video') {
            const res = await fetch('/api/media/videos/direct-upload', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ projectId })
            });
            if (!res.ok) throw new Error('failed to get upload url');
            const { uploadURL, videoId } = await res.json();
            await xhrUpload('POST', uploadURL, q.file, (p) => tick(qid, p));
            const url = cloudflareStreamIframeUrl(videoId);
            await saveMeta(q.file.name, 'video', q.file.size, projectId, url, { videoId });
            setQueue(prev => prev.map(it => it.id === qid ? { ...it, status: 'done', progress: 100, metaUrl: url } : it));
          } else {
            const contentType = q.file.type || 'application/octet-stream';
            const res = await fetch('/api/portal/files/presign', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ filename: q.file.name, contentType, size: q.file.size, projectId })
            });
            if (!res.ok) throw new Error('failed to presign');
            const { url, key } = await res.json();
            await xhrUpload('PUT', url, q.file, (p) => tick(qid, p), { 'x-amz-content-sha256': 'UNSIGNED-PAYLOAD', 'Content-Type': contentType });
            await saveMeta(q.file.name, 'document', q.file.size, projectId, key);
            setQueue(prev => prev.map(it => it.id === qid ? { ...it, status: 'done', progress: 100, metaUrl: key } : it));
          }
          // notify parent after each successful file
          onUploaded();
        } catch (e) {
          const msg = e instanceof Error ? e.message : 'failed';
          setQueue(prev => prev.map(it => it.id === qid ? { ...it, status: 'error', error: msg } : it));
        }
      }
    } finally {
      setBusy(false);
    }
  }, [busy, projectId, queue, onUploaded]);

  const tick = (qid: string, progress: number) => {
    setQueue(prev => prev.map(it => it.id === qid ? { ...it, progress } : it));
  };

  const xhrUpload = (method: 'POST'|'PUT', url: string, file: File, onProgress: (p: number)=>void, headers?: Record<string, string>) => {
    return new Promise<void>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open(method, url, true);
      if (headers) {
        for (const [k,v] of Object.entries(headers)) xhr.setRequestHeader(k, v);
      }
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
      };
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) resolve();
        else reject(new Error('upload error'));
      };
      xhr.onerror = () => reject(new Error('network error'));
      xhr.send(file);
    });
  };

  const saveMeta = async (name: string, type: UploadKind, size: number, projectId: string, url: string, extra?: Record<string, unknown>) => {
    const res = await fetch('/api/portal/files', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, type, size, projectId, url, description: '', ...(extra||{}) })
    });
    if (!res.ok) throw new Error('failed to save metadata');
  };

  const onInput = (e: React.ChangeEvent<HTMLInputElement>) => addFilesToQueue(e.target.files);
  const onDrop = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); setDrag(false); addFilesToQueue(e.dataTransfer.files); };
  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); setDrag(true); };
  const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); setDrag(false); };

  return (
    <div className={`bg-[var(--card)] border border-[var(--elev)] rounded-[var(--radius-lg)] p-4 ${className}`}>
      <div className="flex items-center gap-2 mb-3">
        <button onClick={() => setKind('image')} className={`px-3 py-1 rounded text-sm ${kind==='image'?'bg-[var(--accent-500)] text-white':'bg-[var(--bg)] border border-[var(--elev)]'}`}>صور</button>
        <button onClick={() => setKind('video')} className={`px-3 py-1 rounded text-sm ${kind==='video'?'bg-[var(--accent-500)] text-white':'bg-[var(--bg)] border border-[var(--elev)]'}`}>فيديو</button>
        <button onClick={() => setKind('document')} className={`px-3 py-1 rounded text-sm ${kind==='document'?'bg-[var(--accent-500)] text-white':'bg-[var(--bg)] border border-[var(--elev)]'}`}>مستندات</button>
        <div className="ml-auto text-xs text-[var(--slate-600)]">اسحب الملفات أو اخترها، ثم اضغط ابدأ</div>
      </div>

      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={`rounded-md border-2 border-dashed p-4 text-center ${drag ? 'border-[var(--accent-500)] bg-[var(--elev)]/30' : 'border-[var(--elev)] bg-[var(--bg)]'}`}
      >
        <div className="text-sm text-[var(--slate-600)] mb-2">{projectId ? 'اسحب ملفاتك هنا' : '⚠️ اختر مشروعاً أولاً'}</div>
        <label className="inline-flex items-center gap-2 text-[var(--accent-600)] underline cursor-pointer">
          <input type="file" multiple accept={acceptAttr} disabled={!projectId} onChange={onInput} className="hidden" />
          اختر ملفات
        </label>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div className="text-xs text-[var(--slate-600)]">في الطابور: {queue.filter(q => q.status==='queued').length} / الكل: {queue.length}</div>
        <Button onClick={uploadSequential} disabled={!projectId || busy || queue.every(q => q.status!=='queued')} className="px-4 py-2">{busy ? 'جاري الرفع...' : 'ابدأ الرفع'}</Button>
      </div>

      {queue.length > 0 && (
        <div className="mt-4 space-y-2 max-h-64 overflow-auto">
          {queue.map(item => (
            <div key={item.id} className="p-2 rounded border border-[var(--elev)] bg-[var(--bg)]">
              <div className="flex items-center justify-between gap-2">
                <div className="truncate text-sm text-[var(--text)]">{item.file.name} <span className="text-[var(--slate-500)]">({item.kind})</span></div>
                <div className="text-xs">
                  {item.status === 'queued' && <span className="text-[var(--slate-600)]">بالانتظار</span>}
                  {item.status === 'uploading' && <span className="text-[var(--accent-600)]">جاري الرفع {item.progress}%</span>}
                  {item.status === 'done' && <span className="text-green-600">تم</span>}
                  {item.status === 'error' && <span className="text-red-600">فشل</span>}
                </div>
              </div>
              <div className="h-2 w-full bg-[var(--elev)] rounded mt-2">
                <div className={`h-2 rounded ${item.status==='error'?'bg-red-400':'bg-[var(--accent-500)]'}`} style={{ width: `${item.progress}%` }} />
              </div>
              {item.error && <div className="text-xs text-red-600 mt-1">{item.error}</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


