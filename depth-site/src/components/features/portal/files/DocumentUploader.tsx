"use client";

import { useState } from "react";

export default function DocumentUploader({ projectId, onUploaded }: { projectId: string; onUploaded: () => void }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [docKey, setDocKey] = useState<string | null>(null);

  const onPick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      const contentType = file.type || 'application/octet-stream';
      const res = await fetch('/api/portal/files/presign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: file.name, contentType, size: file.size, projectId })
      });
      if (!res.ok) throw new Error('failed to presign');
      const { url, key } = await res.json();
      const put = await fetch(url, { method: 'PUT', headers: { 'x-amz-content-sha256': 'UNSIGNED-PAYLOAD', 'Content-Type': contentType }, body: file });
      if (!put.ok) throw new Error('failed to upload');
      setDocKey(key);
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
      <div className="text-sm font-medium mb-2">رفع ملف (R2 Documents)</div>
      <label className="block">
        <input type="file" accept="application/pdf,application/zip,image/*,video/mp4" onChange={onPick} disabled={busy} />
      </label>
      {busy && <div className="text-xs text-[var(--slate-600)] mt-2">جاري الرفع...</div>}
      {error && <div className="text-xs text-red-600 mt-2">{error}</div>}
      {docKey && (
        <div className="mt-3 text-xs space-y-1">
          <div>key: {docKey}</div>
        </div>
      )}
    </div>
  );
}


