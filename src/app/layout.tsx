import type { Metadata } from "next";
import { Raleway } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import AdBanner from "@/components/AdSense";

const inter = Raleway({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Spool",
	description: "Share your thoughts with ease",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<head>
				<script
					async
					src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_GOOGLE_ADS_CLIENT_ID}`}
					crossOrigin="anonymous"
				></script>
			</head>
			<body className={`${inter.className} bg-dark-1`}>
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
