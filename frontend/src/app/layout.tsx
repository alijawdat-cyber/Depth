import React from "react";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "@/styles/01-base/globals.css";
import { ColorSchemeScript } from "@mantine/core";
import { UiProviders } from "@/ui/app-shell/UiProviders";

export const metadata = {
	title: "Depth",
	description: "Unified UI with Mantine + Tailwind tokens",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="ar" dir="rtl" suppressHydrationWarning>
			<head>
				<ColorSchemeScript />
				<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
				{/* Preload Dubai fonts to reduce FOUT while keeping @font-face in CSS */}
				<link rel="preload" href="/fonts/Dubai-Regular.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
				<link rel="preload" href="/fonts/Dubai-Medium.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
				<link rel="preload" href="/fonts/Dubai-Bold.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
			</head>
			<body dir="rtl">
				<UiProviders>{children}</UiProviders>
			</body>
		</html>
	);
}

