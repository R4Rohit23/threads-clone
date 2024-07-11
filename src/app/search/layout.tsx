import Navbar from "@/common/Navbar";
import MobNavbar from "@/components/Home/MobNavbar";

export default function ThreadLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={`bg-dark-1 h-screen relative`}>
				<Navbar />
				<div className="text-white mx-auto max-w-xl mt-10 flex flex-col">
					{children}
				</div>
				<div className="absolute w-full bottom-0">
					<MobNavbar />
				</div>
			</body>
		</html>
	);
}
