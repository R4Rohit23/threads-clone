import Navbar from "@/common/Navbar";

export default function ThreadLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={` bg-dark-1`}>
				<Navbar />
				<div className="text-white mx-auto max-w-3xl mt-10 flex flex-col">
					<h1 className="text-white text-xl font-semibold">My Saved Threads</h1>
					{children}
				</div>
			</body>
		</html>
	);
}
