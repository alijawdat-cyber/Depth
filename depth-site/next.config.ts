import type { NextConfig } from "next";

const isExport = process.env.NEXT_EXPORT === "true";
const repoBase = "Depth"; // GitHub project pages base path

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [360, 640, 768, 1024, 1280, 1536],
    imageSizes: [16, 24, 32, 48, 64, 96, 128],
    remotePatterns: [
      { protocol: 'https', hostname: 'imagedelivery.net' },
    ],
    ...(isExport ? { unoptimized: true } : {}),
  },
  // Vercel deployment: no basePath needed for custom domain
  ...(isExport
    ? {
        output: "export",
        basePath: `/${repoBase}`,
        assetPrefix: `/${repoBase}/`,
      }
    : {}),
};

export default nextConfig;
