"use client";
import Navbar from "@/common/Navbar";
import HomePage from "@/components/Home/Home";
import { useEffect } from "react";
import { pusherClient } from "@/lib/pusher";

export default function Home() {
	// useEffect(() => {
	// 	pusherClient.subscribe("main-channel");
		
	// 	pusherClient.bind("connect", (data: any) => {
	// 		console.log(data);
	// 	});
	// 	return () => {
	// 		pusherClient.unbind("connect");
	// 		pusherClient.unsubscribe("connect");
	// 	};
	// }, []);

	return (
		<div className="bg-dark-1">
			<Navbar />
			<HomePage />
		</div>
	);
}
