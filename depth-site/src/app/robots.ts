import type { MetadataRoute } from "next";
export const dynamic = "force-static";
import { getSiteUrl } from "@/lib/constants/site";

export default function robots(): MetadataRoute.Robots {
  const base = getSiteUrl();
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${base}/sitemap.xml`,
  };
}


