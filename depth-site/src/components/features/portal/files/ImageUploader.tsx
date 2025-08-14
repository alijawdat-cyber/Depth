"use client";

import { useState } from "react";
import { cloudflareImageUrl } from "@/lib/cloudflare-public";

export default function ImageUploader({ projectId, onUploaded }: { projectId: string; onUploaded: () => void }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewId, setPreviewId] = useState<string | null>(null);

  const onPick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      const ct = file.type || "image/webp";
      const res = await fetch('/api/media/images/direct-upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId, contentType: ct, size: file.size })
      });
      if (!res.ok) throw new Error('failed to get upload url');
      const { uploadURL, id } = await res.json();
      const up = await fetch(uploadURL, { method: 'POST', body: file });
      if (!up.ok) throw new Error('failed to upload');
      setPreviewId(id);

      // Save metadata so it appears in Files list
      const url = cloudflareImageUrl(id, 'preview');
      await fetch('/api/portal/files', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: file.name,
          type: 'image',
          size: file.size,
          projectId,
          url,
          description: ''
        })
      });

      onUploaded();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'failed';
      setError(msg);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="p-3 border border-[var(--elev)] rounded-[var(--radius)] bg-[var(--bg)]">
      <div className="text-sm font-medium mb-2">رفع صورة (Cloudflare Images)</div>
      <label className="block">
        <input type="file" accept="image/*" onChange={onPick} disabled={busy} />
      </label>
      {busy && <div className="text-xs text-[var(--slate-600)] mt-2">جاري الرفع...</div>}
      {error && <div className="text-xs text-red-600 mt-2">{error}</div>}
      {previewId && (
        <div className="mt-3 text-xs space-y-1">
          <div>imageId: {previewId}</div>
          <a className="text-[var(--accent-600)] underline" href={cloudflareImageUrl(previewId, 'thumb')} target="_blank">thumb</a>
          <span> · </span>
          <a className="text-[var(--accent-600)] underline" href={cloudflareImageUrl(previewId, 'preview')} target="_blank">preview</a>
          <span> · </span>
          <a className="text-[var(--accent-600)] underline" href={cloudflareImageUrl(previewId, 'hero')} target="_blank">hero</a>
        </div>
      )}
    </div>
  );
}


