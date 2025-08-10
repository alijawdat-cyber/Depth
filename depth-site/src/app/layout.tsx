import type { Metadata } from "next";
import Providers from "./providers";
import "./globals.css";


const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://depth-agency.com").replace(/\/$/, "");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Depth — محتوى يحرّك النتائج",
    template: "%s | Depth",
  },
  description: "استوديو/وكالة Performance + Content: سرعة إنتاج، هامش مضبوط، وقياس واضح.",
  openGraph: {
    type: "website",
    locale: "ar_IQ",
    siteName: "Depth",
    title: "Depth — محتوى يحرّك النتائج",
    description: "استوديو/وكالة Performance + Content: سرعة إنتاج، هامش مضبوط، وقياس واضح.",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
  },
  alternates: {
    canonical: siteUrl,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Depth',
              url: siteUrl,
              logo: `${siteUrl}/depth-logo.svg`,
              sameAs: ['https://instagram.com/', 'https://x.com/'],
            }),
          }}
        />
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              url: siteUrl,
              name: 'Depth',
            }),
          }}
        />
      </head>
      <body className="antialiased">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-[var(--accent-500)] text-[var(--text-dark)] px-3 py-2 rounded-[var(--radius-sm)]">تخطّ إلى المحتوى</a>
        <Providers>
          <main id="main-content">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
