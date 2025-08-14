"use client";

import { useState } from "react";
import { cloudflareStreamIframeUrl } from "@/lib/cloudflare-public";

export default function VideoUploader({ projectId, onUploaded }: { projectId: string; onUploaded: () => void }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [videoId, setVideoId] = useState<string | null>(null);

  const onPick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch('/api/media/videos/direct-upload', { method: 'POST' });
      if (!res.ok) throw new Error('failed to get upload url');
      const { uploadURL, videoId } = await res.json();
      const up = await fetch(uploadURL, { method: 'POST', body: file });
      if (!up.ok) throw new Error('failed to upload');
      setVideoId(videoId);
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
      <div className="text-sm font-medium mb-2">رفع فيديو (Cloudflare Stream)</div>
      <label className="block">
        <input type="file" accept="video/mp4" onChange={onPick} disabled={busy} />
      </label>
      {busy && <div className="text-xs text-[var(--slate-600)] mt-2">جاري الرفع...</div>}
      {error && <div className="text-xs text-red-600 mt-2">{error}</div>}
      {videoId && (
        <div className="mt-3 text-xs space-y-1">
          <div>videoId: {videoId}</div>
          <a className="text-[var(--accent-600)] underline" href={cloudflareStreamIframeUrl(videoId)} target="_blank">فتح iframe</a>
        </div>
      )}
    </div>
  );
}


