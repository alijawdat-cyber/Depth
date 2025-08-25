import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/shared/theme";

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
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
