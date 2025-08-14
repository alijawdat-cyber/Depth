"use client";

import { useState } from "react";
import { cloudflareImageUrl } from "@/lib/cloudflare-public";

export default function TestUploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [imageId, setImageId] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const onPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    setFile(f);
    setError(null);
    setPreviewUrl(f ? URL.createObjectURL(f) : null);
  };

  const upload = async () => {
    try {
      if (!file) return;
      setBusy(true);
      setError(null);
      setProgress(0);

      // 1) Get direct upload URL from our API
      const ct = file.type || "image/jpeg";
      console.log('[test-upload] requesting direct upload...');
      const res = await fetch("/api/media/images/direct-upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contentType: ct, size: file.size })
      });
      if (!res.ok) {
        const t = await res.text();
        console.error('[test-upload] direct upload failed', res.status, t);
        throw new Error("failed to create direct upload");
      }
      const { uploadURL, id, warning } = await res.json();
      if (!uploadURL || !id) throw new Error("invalid upload url response");

      // 2) Upload the file to Cloudflare using multipart/form-data (required by v2)
      await new Promise<void>(async (resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", uploadURL, true);
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) setProgress(Math.round((e.loaded / e.total) * 100));
        };
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) resolve();
          else {
            console.error('[test-upload] upload error', xhr.status, xhr.responseText?.slice(0,200));
            reject(new Error(`upload failed (${xhr.status})`));
          }
        };
        xhr.onerror = () => { console.error('[test-upload] network error'); reject(new Error("network error")); };
        const form = new FormData();
        form.append("file", file, file.name);
        xhr.send(form);
      });

      setImageId(id);
      const url = cloudflareImageUrl(id, "preview");
      console.log('[test-upload] done. imageId=', id, 'url=', url);
      setPreviewUrl(url);
      setProgress(100);
    } catch (e) {
      setError(e instanceof Error ? e.message : "failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-xl font-semibold mb-4">اختبار رفع صورة (Cloudflare Images)</h1>
      <p className="text-sm text-gray-600 mb-3">هذه صفحة اختبارية بسيطة لرفع صورة واحدة وعرضها مباشرة من Cloudflare.</p>

      <input type="file" accept="image/*" onChange={onPick} className="mb-3" />
      <div className="flex items-center gap-2 mb-4">
        <button onClick={upload} disabled={!file || busy} className="px-4 py-2 rounded bg-black text-white disabled:opacity-50">
          {busy ? "جاري الرفع..." : "ارفع الآن"}
        </button>
        {progress > 0 && <span className="text-sm text-gray-700">{progress}%</span>}
      </div>

      {error && <div className="p-2 rounded bg-red-50 border border-red-200 text-red-700 text-sm mb-3">خطأ: {error}</div>}

      {previewUrl && (
        <div className="space-y-2">
          <div className="text-sm text-gray-700">نتيجة:</div>
          <img src={previewUrl} alt="preview" className="w-64 h-64 object-cover rounded border" />
          {imageId && (
            <div className="text-xs text-gray-600 break-all">
              Image ID: {imageId}
              <br />
              URL: {cloudflareImageUrl(imageId, "preview")}
            </div>
          )}
        </div>
      )}
    </div>
  );
}


