import React from "react";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "@/styles/01-foundation/globals.css";
import { ColorSchemeScript } from "@mantine/core";
import { UiProviders } from "@/styles/03-layout/app-shell/UiProviders";

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
			</head>
			<body dir="rtl">
				<UiProviders>{children}</UiProviders>
			</body>
		</html>
	);
}

