import type { Metadata } from "next";
import { Raleway } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

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
			<body className={`${inter.className} bg-dark-1`}>
				<Providers>
					{children}
				</Providers>
			</body>
		</html>
	);
}
