import Navbar from "@/common/Navbar";
import MobNavbar from "@/components/Home/MobNavbar";

export default function CommentLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={`bg-dark-1`}>
				<Navbar />
				<div className="text-white mx-auto max-w-3xl mt-10 flex flex-col">
					{children}
				</div>
			</body>
		</html>
	);
}
