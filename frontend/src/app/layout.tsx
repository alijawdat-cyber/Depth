import type { Metadata } from "next";
import "./globals.css";
import { MantineProvider, ColorSchemeScript } from "@mantine/core";
import ErrorBoundary from "@/components/ErrorBoundary";
import "@mantine/core/styles.css";

export const metadata: Metadata = {
  title: "Depth Frontend",
  description: "منصة Depth — واجهة فرونت-إند موحّدة (Tokens/Components/Screens)",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <ColorSchemeScript defaultColorScheme="auto" />
      </head>
      <body className="antialiased">
        <ErrorBoundary>
          <MantineProvider defaultColorScheme="auto">
            <div className="min-h-dvh">
              <main className="mx-auto max-w-screen-xl appMain">
                {children}
              </main>
            </div>
          </MantineProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
