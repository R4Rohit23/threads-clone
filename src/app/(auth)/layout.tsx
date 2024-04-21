"use client";

import "../globals.css";
import Image from "next/image";

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) 
{
	return (
		<html lang="en">
			<body className="bg-dark-1">
				<Image
					src="/assets/ThreadsBanner.webp"
					alt="banner"
					width={500}
					height={500}
					layout="responsive"
				/>
				{children}
			</body>
		</html>
	);
}
