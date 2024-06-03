import Navbar from "@/common/Navbar";

export default function ThreadLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={`bg-dark-1`}>
				<Navbar />
				<div className="text-white mx-auto max-w-xl mt-10 flex flex-col">
					{children}
				</div>
			</body>
		</html>
	);
}
