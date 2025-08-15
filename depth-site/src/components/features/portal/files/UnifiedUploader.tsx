"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as tus from "tus-js-client";
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
  previewUrl?: string; // local preview for images
  speedBps?: number; // bytes per second
  etaSec?: number; // estimated seconds remaining
};

export default function UnifiedUploader({ projectId, onUploaded, className = "" }: Props) {
  const [kind, setKind] = useState<UploadKind>('image');
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [busy, setBusy] = useState(false);
  const [drag, setDrag] = useState(false);
  const [isMock, setIsMock] = useState(false);
  const concurrency = 2;

  // Refs for control and progress calculations
  const xhrById = useRef(new Map<string, XMLHttpRequest>());
  const lastTickById = useRef(new Map<string, { time: number; loaded: number }>());
  const queueRef = useRef<QueueItem[]>([]);
  useEffect(() => { queueRef.current = queue; }, [queue]);
  const tusById = useRef(new Map<string, tus.Upload>());

  const acceptAttr = useMemo(() => {
    if (kind === 'image') return 'image/*';
    if (kind === 'video') return 'video/*';
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
      previewUrl: kind === 'image' ? URL.createObjectURL(f) : undefined,
    }));
    setQueue(prev => [...prev, ...items]);
  };

  // Magic bytes validation for basic types
  const validateMagicBytes = async (file: File, kind: UploadKind): Promise<void> => {
    const head = file.slice(0, 16);
    const buf = await head.arrayBuffer();
    const bytes = new Uint8Array(buf);
    const isJPEG = bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
    const isPNG = bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47;
    const isWEBP = bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 && bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50;
    const isPDF = bytes[0] === 0x25 && bytes[1] === 0x50 && bytes[2] === 0x44 && bytes[3] === 0x46; // %PDF
    const isZIP = bytes[0] === 0x50 && bytes[1] === 0x4b; // PK
    const isMP4 = bytes[4] === 0x66 && bytes[5] === 0x74 && bytes[6] === 0x79 && bytes[7] === 0x70; // ftyp
    if (kind === 'image' && !(isJPEG || isPNG || isWEBP)) throw new Error('نوع صورة غير صالح');
    if (kind === 'video' && !isMP4) {
      // نسمح بأنواع أخرى عبر Cloudflare، لكن إن لم يكن MP4 قد لا تُعرض المعاينة محليًا
      // لا نفشل هنا لتجنب منع upload لأن Stream يدعم عدة حاويات
      return;
    }
    if (kind === 'document' && !(isPDF || isZIP)) throw new Error('نوع مستند غير صالح');
  };

  const uploadWithConcurrency = useCallback(async () => {
    if (!projectId || busy) return;
    setBusy(true);
    try {
      const runNext = async (): Promise<void> => {
        const next = queueRef.current.find(it => it.status === 'queued');
        if (!next) return;
        const qid = next.id;
        const q = next;
        setQueue(prev => prev.map(it => it.id === qid ? { ...it, status: 'uploading', progress: 0, error: undefined } : it));
        try {
          await validateMagicBytes(q.file, q.kind);
          if (q.kind === 'image') {
            const ct = q.file.type || 'image/webp';
            const res = await fetch('/api/media/images/direct-upload', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ projectId, contentType: ct, size: q.file.size })
            });
            if (!res.ok) throw new Error('failed to get upload url');
            const { uploadURL, id, warning } = await res.json();
            if (warning) setIsMock(true);
            // Cloudflare Images upload: capture the final returned imageId if provided by the upload endpoint
            const uploadedId = await xhrUploadForm('POST', uploadURL, qid, q.file, (loaded, total) => tick(qid, loaded, total));
            const finalId = typeof uploadedId === 'string' && uploadedId.length > 0 ? uploadedId : id;
            const url = cloudflareImageUrl(finalId, 'preview');
            await saveMeta(q.file.name, 'image', q.file.size, projectId, url, { imageId: finalId, contentType: ct });
            setQueue(prev => prev.map(it => it.id === qid ? { ...it, status: 'done', progress: 100, metaUrl: url } : it));
          } else if (q.kind === 'video') {
            const res = await fetch('/api/media/videos/direct-upload', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ projectId })
            });
            if (!res.ok) throw new Error('failed to get upload url');
            const { uploadURL, videoId, warning } = await res.json();
            if (warning) setIsMock(true);
            // Cloudflare Stream Direct Creator Upload: multipart/form-data with field name "file"
            await xhrUploadForm('POST', uploadURL, qid, q.file, (loaded, total) => tick(qid, loaded, total));
            const url = cloudflareStreamIframeUrl(videoId);
            await saveMeta(q.file.name, 'video', q.file.size, projectId, url, { videoId, contentType: q.file.type || 'video/mp4' });
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
            await xhrUpload('PUT', url, qid, q.file, (loaded, total) => tick(qid, loaded, total), { 'x-amz-content-sha256': 'UNSIGNED-PAYLOAD', 'Content-Type': contentType });
            await saveMeta(q.file.name, 'document', q.file.size, projectId, key, { contentType });
            setQueue(prev => prev.map(it => it.id === qid ? { ...it, status: 'done', progress: 100, metaUrl: key } : it));
          }
          onUploaded();
        } catch (e) {
          const msg = e instanceof Error ? e.message : 'failed';
          setQueue(prev => prev.map(it => it.id === qid ? { ...it, status: 'error', error: msg } : it));
        } finally {
          xhrById.current.delete(qid);
          lastTickById.current.delete(qid);
          const up = tusById.current.get(qid);
          if (up) tusById.current.delete(qid);
        }
      };

      // Worker pool
      const workers: Array<Promise<void>> = [];
      for (let i = 0; i < concurrency; i++) {
        workers.push((async () => {
          // Continuously process until no queued items remain
          // eslint-disable-next-line no-constant-condition
          while (true) {
            const hasQueued = queueRef.current.some(it => it.status === 'queued');
            if (!hasQueued) break;
            // Run one
            await runNext();
          }
        })());
      }
      await Promise.all(workers);
    } finally {
      setBusy(false);
    }
  }, [projectId, busy, queue, onUploaded]);

  const tick = (qid: string, loaded: number, total: number) => {
    const now = performance.now();
    const last = lastTickById.current.get(qid) || { time: now, loaded: 0 };
    const dt = Math.max(1, now - last.time);
    const dBytes = Math.max(0, loaded - last.loaded);
    const speedBps = (dBytes * 1000) / dt;
    const remaining = Math.max(0, total - loaded);
    const etaSec = speedBps > 0 ? Math.round(remaining / speedBps) : undefined;
    lastTickById.current.set(qid, { time: now, loaded });
    const pct = Math.round((loaded / total) * 100);
    setQueue(prev => prev.map(it => it.id === qid ? { ...it, progress: pct, speedBps, etaSec } : it));
  };

  const xhrUploadForm = (method: 'POST'|'PUT', url: string, qid: string, file: File, onProgress: (loaded: number, total: number)=>void) => {
    return new Promise<string>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhrById.current.set(qid, xhr);
      xhr.open(method, url, true);
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) onProgress(e.loaded, e.total);
      };
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const json = JSON.parse(xhr.responseText || '{}');
            // v2 response: { result: { id: '...' } } or { id: '...' }
            const id = json?.result?.id || json?.id || '';
            resolve(typeof id === 'string' ? id : '');
          } catch {
            resolve('');
          }
        } else reject(new Error('upload error'));
      };
      xhr.onerror = () => reject(new Error('network error'));
      xhr.onabort = () => reject(new Error('canceled'));
      const form = new FormData();
      form.append('file', file, file.name);
      xhr.send(form);
    });
  };

  const xhrUpload = (method: 'POST'|'PUT', url: string, qid: string, file: File, onProgress: (loaded: number, total: number)=>void, headers?: Record<string, string>) => {
    return new Promise<void>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhrById.current.set(qid, xhr);
      xhr.open(method, url, true);
      if (headers) {
        for (const [k,v] of Object.entries(headers)) xhr.setRequestHeader(k, v);
      }
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) onProgress(e.loaded, e.total);
      };
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) resolve();
        else reject(new Error('upload error'));
      };
      xhr.onerror = () => reject(new Error('network error'));
      xhr.onabort = () => reject(new Error('canceled'));
      xhr.send(file);
    });
  };

  const saveMeta = async (name: string, type: UploadKind, size: number, projectId: string, url: string, extra?: Record<string, unknown>) => {
    const res = await fetch('/api/portal/files', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'credentials': 'include'
      },
      credentials: 'include',
      body: JSON.stringify({ name, type, size, projectId, url, description: '', ...(extra||{}) })
    });
    if (!res.ok) {
      // Read structured error
      let code: string | undefined;
      let message = 'failed to save metadata';
      try {
        const data = await res.json();
        code = data?.code || data?.error;
        message = data?.message || data?.error || message;
      } catch {}

      console.error('saveMeta error:', message, 'Status:', res.status, 'Code:', code);

      // Accept 202 as non-fatal (metadata pending). Let caller proceed.
      if (res.status === 202 || code === 'UPLOAD_OK_METADATA_PENDING') return;

      // Non-fatal UX for known auth/project errors: show error but do not throw to keep optimistic card
      if (res.status === 401 || code === 'UNAUTHORIZED') return;
      if (res.status === 403 || code === 'FORBIDDEN_PROJECT') return;
      if (res.status === 404 || code === 'PROJECT_NOT_FOUND') return;

      // For hard errors, throw to mark item as error
      throw new Error(message);
    }
  };

  const onInput = (e: React.ChangeEvent<HTMLInputElement>) => addFilesToQueue(e.target.files);
  const onDrop = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); setDrag(false); addFilesToQueue(e.dataTransfer.files); };
  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); setDrag(true); };
  const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); setDrag(false); };

  const cancelItem = (id: string) => {
    const xhr = xhrById.current.get(id);
    if (xhr) xhr.abort();
    const up = tusById.current.get(id);
    if (up) up.abort();
    setQueue(prev => prev.map(it => it.id === id ? { ...it, status: 'error', error: 'أُلغي من قبل المستخدم' } : it));
  };

  const retryItem = (id: string) => {
    setQueue(prev => prev.map(it => it.id === id ? { ...it, status: 'queued', progress: 0, error: undefined } : it));
  };

  useEffect(() => {
    return () => {
      // Revoke previews on unmount
      queue.forEach(q => { if (q.previewUrl) URL.revokeObjectURL(q.previewUrl); });
      xhrById.current.forEach(x => x.abort());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={`bg-[var(--card)] border border-[var(--elev)] rounded-[var(--radius-lg)] p-4 ${className}`}>
      <div className="flex items-center gap-2 mb-3">
        <button onClick={() => setKind('image')} className={`px-3 py-1 rounded text-sm ${kind==='image'?'bg-[var(--accent-500)] text-[var(--text-dark)]':'bg-[var(--bg)] border border-[var(--elev)]'}`}>صور</button>
        <button onClick={() => setKind('video')} className={`px-3 py-1 rounded text-sm ${kind==='video'?'bg-[var(--accent-500)] text-[var(--text-dark)]':'bg-[var(--bg)] border border-[var(--elev)]'}`}>فيديو</button>
        <button onClick={() => setKind('document')} className={`px-3 py-1 rounded text-sm ${kind==='document'?'bg-[var(--accent-500)] text-[var(--text-dark)]':'bg-[var(--bg)] border border-[var(--elev)]'}`}>مستندات</button>
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

      {isMock && (
        <div className="mt-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded p-2">
          بيئة تجريبية: تم استخدام Mock Upload بسبب نقص إعدادات Cloudflare.
        </div>
      )}

      <div className="mt-3 flex items-center justify-between">
        <div className="text-xs text-[var(--slate-600)]">في الطابور: {queue.filter(q => q.status==='queued').length} / الكل: {queue.length} — التوازي: {concurrency}</div>
        <Button onClick={uploadWithConcurrency} disabled={!projectId || busy || queue.every(q => q.status!=='queued')} className="px-4 py-2">{busy ? 'جاري الرفع...' : 'ابدأ الرفع'}</Button>
      </div>

      {queue.length > 0 && (
        <div className="mt-4 space-y-2 max-h-64 overflow-auto">
          {queue.map(item => (
            <div key={item.id} className="p-2 rounded border border-[var(--elev)] bg-[var(--bg)]">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 truncate text-sm text-[var(--text)]">
                  {item.previewUrl && (
                    <img src={item.previewUrl} alt="preview" className="w-8 h-8 rounded object-cover border border-[var(--elev)]" />
                  )}
                  <span className="truncate" title={item.file.name}>{item.file.name}</span>
                  <span className="text-[var(--slate-500)]">({item.kind})</span>
                </div>
                <div className="text-xs" aria-live="polite">
                  {item.status === 'queued' && <span className="text-[var(--slate-600)]">بالانتظار</span>}
                  {item.status === 'uploading' && (
                    <span className="text-[var(--accent-600)]">
                      جاري الرفع {item.progress}%
                      {typeof item.speedBps === 'number' && (
                        <>
                          {' '}— {formatBytes(item.speedBps)}/ث — {item.etaSec ? formatEta(item.etaSec) : '...'} متبقية
                        </>
                      )}
                    </span>
                  )}
                  {item.status === 'done' && <span className="text-green-600">تم</span>}
                  {item.status === 'error' && <span className="text-red-600">فشل</span>}
                </div>
              </div>
              <div className="h-2 w-full bg-[var(--elev)] rounded mt-2" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={item.progress}>
                <div className={`h-2 rounded ${item.status==='error'?'bg-red-400':'bg-[var(--accent-500)]'}`} style={{ width: `${item.progress}%` }} />
              </div>
              {item.error && <div className="text-xs text-red-600 mt-1">{item.error}</div>}
              <div className="mt-2 flex items-center gap-2">
                {item.status === 'uploading' && (
                  <Button variant="ghost" size="sm" onClick={() => cancelItem(item.id)}>إلغاء</Button>
                )}
                {item.status === 'error' && (
                  <Button variant="ghost" size="sm" onClick={() => retryItem(item.id)}>إعادة المحاولة</Button>
                )}
                {item.metaUrl && item.status === 'done' && (
                  <a className="text-xs text-[var(--accent-600)] underline" href={item.metaUrl} target="_blank">فتح</a>
                )}
              </div>
            </div>
          ))}
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


