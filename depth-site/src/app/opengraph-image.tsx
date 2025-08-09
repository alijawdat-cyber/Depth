import { ImageResponse } from "next/og";

// Avoid prerendering at build time due to Satori limitations with Arabic shaping
export const dynamic = "force-dynamic";
export const runtime = "edge";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

// حاول تحميل خط محلي من مجلد public (Edge runtime يسمح بـ new URL + import.meta.url)
async function loadDubai() {
  try {
    const url = new URL("../../public/fonts/Dubai-Regular.woff2", import.meta.url);
    const res = await fetch(url);
    if (!res.ok) throw new Error("font fetch failed");
    return await res.arrayBuffer();
  } catch {
    return null;
  }
}

export default async function OGImage() {
  const title = "Depth — محتوى يحرّك النتائج";
  const dubai = await loadDubai();
  if (!dubai) {
    // Fallback هادئ بدون نص لتفادي متطلبات الخطوط على Satori
    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(120deg, #1A232C, #253DB8)",
          }}
        />
      ),
      { ...size }
    );
  }

  return new ImageResponse(
    (
      <div
        dir="rtl"
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(120deg, #1A232C, #253DB8)",
          color: "#fff",
          fontSize: 56,
          padding: 60,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 980 }}>
          <span style={{ fontSize: 24, opacity: 0.85 }}>Depth</span>
          <strong style={{ fontSize: 72, lineHeight: 1.1 }}>{title}</strong>
          <span style={{ fontSize: 28, opacity: 0.9 }}>سرعة إنتاج، هامش مضبوط، وقياس واضح.</span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Dubai",
          data: dubai,
          style: "normal",
          weight: 400,
        },
      ],
    }
  );
}


