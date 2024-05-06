import type { Metadata } from "next";
import { Inter } from "next/font/google";
// import "../globals.css";
import Navbar from "@/common/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Create Next App",
	description: "Generated by create next app",
};

export default function CommentLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={`${inter.className} bg-dark-1`}>
				<Navbar />
				<div className="text-white mx-auto max-w-3xl mt-10 flex flex-col">
					{children}
				</div>
			</body>
		</html>
	);
}