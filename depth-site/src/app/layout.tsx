import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import { Noto_Naskh_Arabic } from "next/font/google";
import Providers from "./providers";
import "./globals.css";

export const dynamic = "force-dynamic";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const arabic = Noto_Naskh_Arabic({ subsets: ["arabic"], variable: "--font-ar", display: "swap" });

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://depth-agency.com").replace(/\/$/, "");

export const metadata: Metadata = {
  metadataBase: new URL("https://depth-agency.com"),
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
    <html lang="ar" dir="rtl" className={`${arabic.variable}`} suppressHydrationWarning>
      <body className={`${geistMono.variable} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
