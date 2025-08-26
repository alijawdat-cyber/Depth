import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/shared/theme";
import { MantineProvider } from "@mantine/core";
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
      <body className="antialiased">
        <ThemeProvider defaultTheme="system">
          <MantineProvider defaultColorScheme="light" forceColorScheme={undefined}>
            <div className="min-h-dvh bg-[var(--color-bg-surface)] text-[var(--color-fg-primary)]">
              <main className="mx-auto max-w-screen-xl px-[var(--space-4)] py-[var(--space-6)]">
                {children}
              </main>
            </div>
          </MantineProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
