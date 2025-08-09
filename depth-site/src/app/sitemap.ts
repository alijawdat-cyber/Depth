import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || "https://depth-agency.com").replace(/\/$/, "");
  const routes = ["/", "/services", "/work", "/about", "/contact", "/blog"].map((p) => ({
    url: `${base}${p}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: p === "/" ? 1 : 0.7,
  }));
  return routes;
}


