"use client";
import Navbar from "@/common/Navbar";
import HomePage from "@/components/Home/Home";
import MobNavbar from "@/components/Home/MobNavbar";


export default function Home() {
	return (
		<div className="bg-dark-1">
			<Navbar />
			<HomePage />
			<MobNavbar />
		</div>
	);
}
