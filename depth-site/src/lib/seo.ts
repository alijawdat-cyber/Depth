import { DefaultSeoProps } from "next-seo";

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://depth-agency.com").replace(/\/$/, "");

export const defaultSEO: DefaultSeoProps = {
  titleTemplate: "%s | Depth",
  defaultTitle: "Depth — محتوى يحرّك النتائج",
  description:
    "استوديو/وكالة Performance + Content: سرعة إنتاج، هامش مضبوط، وقياس واضح.",
  openGraph: {
    type: "website",
    locale: "ar_IQ",
    url: siteUrl,
    siteName: "Depth",
  },
  twitter: {
    cardType: "summary_large_image",
  },
};


