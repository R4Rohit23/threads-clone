"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import Image from "next/image";

const navLinks = [
	{ name: "Home", icon: "/assets/home-04-stroke-rounded.svg", href: "/" },
	{
		name: "Search",
		icon: "/assets/search-01-stroke-rounded.svg",
		href: "/search",
	},
	{
		name: "Add",
		icon: "/assets/pencil-edit-02-stroke-rounded.svg",
		href: "/thread/create",
	},
	{
		name: "Activity",
		icon: "/assets/favourite-stroke-rounded.svg",
		href: "/activity",
	},
	{
		name: "Profile",
		icon: "/assets/user-stroke-rounded.svg",
		href: "/profile",
	},
];

const MobNavbar = () => {
	const pathname = usePathname();

	return (
		<div className="sticky bottom-0 z-10 bg-dark-1">
			<div className="flex sm:hidden justify-between px-5 items-center">
				{navLinks.map((item, indx) => (
					<Link
						key={indx}
						className={`hover:opacity-100 hover:border-b-2 py-4 transition-all duration-200 ${
							pathname == item.href ? "opacity-100 border-b-2" : "opacity-40"
						}`}
						href={item.href}
					>
						<Image src={item.icon} alt={item.name} width={28} height={28} />
					</Link>
				))}
			</div>
		</div>
	);
};

export default MobNavbar;
