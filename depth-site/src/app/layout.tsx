import type { Metadata } from "next";
import Providers from "./providers";
import "./globals.css";
import { BRAND } from "@/lib/constants/brand";
import { getSiteUrl } from "@/lib/constants/site";


const siteUrl = getSiteUrl();

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FFFFFF' },
    { media: '(prefers-color-scheme: dark)', color: '#0B0F14' }
  ]
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Depth — محتوى يحرّك النتائج",
    template: "%s | Depth",
  },
  description: "استوديو/وكالة Performance + Content: سرعة إنتاج، هامش مضبوط، وقياس واضح.",
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: BRAND.icon, type: 'image/svg+xml' },
    ],
    apple: [
      { url: BRAND.iconApple, sizes: '512x512', type: 'image/png' },
    ],
  },
  openGraph: {
    type: "website",
    locale: "ar_IQ",
    siteName: "Depth",
    title: "Depth — محتوى يحرّك النتائج",
    description: "استوديو/وكالة Performance + Content: سرعة إنتاج، هامش مضبوط، وقياس واضح.",
    url: siteUrl,
    images: [
      {
        url: '/depth-icon-1563x1563-rgba.png',
        width: 1563,
        height: 1563,
        alt: 'Depth Agency Logo',
      },
    ],
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
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Depth',
              url: siteUrl,
              logo: `${siteUrl}${BRAND.logo}`,
              sameAs: [
                'https://www.instagram.com/depth_agency/', 
                'https://www.facebook.com/depthagency',
                'https://www.linkedin.com/company/depth-agency/',
                'https://www.tiktok.com/@depth_agency',
                'https://www.snapchat.com/add/depth_agency'
              ],
            }),
          }}
        />
        <script
          type="application/ld+json"
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
