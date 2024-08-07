"use client";

import React, { Fragment, useState } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PopoverComponent } from "./Popover";
import Notifications from "@/components/Home/Notifications";

function classNames(...classes: string[]) {
	return classes.filter(Boolean).join(" ");
}

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

export default function Navbar() {
	const { data: session } = useSession();
	const [isNotificationOpen, setIsNotificationOpen] = useState<boolean>(false);
	const pathname = usePathname();

	const fullName = session?.user && session?.user.name?.split("").join(" ");

	return (
		<Disclosure
			as="nav"
			className="backdrop-blur-lg shadow-lg sticky top-0 z-10"
		>
			{({ open }) => (
				<>
					<div className="mx-auto max-w-7xl lg:py-2 px-5 sm:px-0">
						<div className="flex h-16 justify-between">
							<div className="flex">
								<Link className="flex flex-shrink-0 items-center" href="/">
									<img
										className="h-8 w-auto"
										src="/assets/pin.png"
										alt="Logo"
									/>
									<p className="hidden italic sm:block text-2xl font-bold text-white pl-2">
										Spool
									</p>
								</Link>
							</div>
							<div className="hidden sm:flex sm:space-x-20 items-center">
								{navLinks.map((item, indx) => (
									<Link
										key={indx}
										className={`hover:opacity-100 hover:border-b-2 py-4 transition-all duration-200 ${
											pathname == item.href
												? "opacity-100 border-b-2"
												: "opacity-40"
										}`}
										href={item.href}
									>
										<Image
											src={item.icon}
											alt={item.name}
											width={28}
											height={28}
										/>
									</Link>
								))}
							</div>
							<div className="flex items-center">
								<PopoverComponent
									isOpen={isNotificationOpen}
									setIsOpen={setIsNotificationOpen}
									content={<Notifications />}
								>
									<button
										type="button"
										className="relative rounded-full  p-1 text-gray-400 hover:text-gray-500"
										onClick={() => setIsNotificationOpen(true)}
									>
										<span className="absolute -inset-1.5" />
										<span className="sr-only">View notifications</span>
										<BellIcon className="h-6 w-6" aria-hidden="true" />
									</button>
								</PopoverComponent>

								{/* Profile dropdown */}
								<Menu as="div" className="relative ml-3">
									<div>
										<Menu.Button className="relative flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
											<span className="absolute -inset-1.5" />
											<span className="sr-only">Open user menu</span>
											<img
												className="h-8 w-8 rounded-full object-cover"
												src={
													(session?.user?.profileImage as string) ??
													(session?.user?.image as string) ??
													`https://ui-avatars.com/api/?name=${fullName}`
												}
												alt=""
											/>
										</Menu.Button>
									</div>
									<Transition
										as={Fragment}
										enter="transition ease-out duration-200"
										enterFrom="transform opacity-0 scale-95"
										enterTo="transform opacity-100 scale-100"
										leave="transition ease-in duration-75"
										leaveFrom="transform opacity-100 scale-100"
										leaveTo="transform opacity-0 scale-95"
									>
										<Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-dark-2 py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
											<Menu.Item>
												{({ active }) => (
													<a
														href="/profile"
														className={classNames(
															"block px-4 py-2 text-sm hover:text-white text-gray-500"
														)}
													>
														Your Profile
													</a>
												)}
											</Menu.Item>
											<Menu.Item>
												{({ active }) => (
													<a
														href="/saved-threads"
														className={classNames(
															"block px-4 py-2 text-sm text-gray-500 hover:text-white"
														)}
													>
														Saved Threads
													</a>
												)}
											</Menu.Item>
											<Menu.Item>
												{({ active }) => (
													<button
														className={classNames(
															"block px-4 py-2 text-sm text-gray-500 hover:text-red-600"
														)}
														onClick={() => {
															signOut({
																callbackUrl: "/",
																redirect: true,
															});
														}}
													>
														Sign out
													</button>
												)}
											</Menu.Item>
										</Menu.Items>
									</Transition>
								</Menu>
							</div>
							
						</div>
					</div>

					<Disclosure.Panel className="sm:hidden">
						<div className="space-y-1 pb-3 pt-2">
							{/* Current: "bg-indigo-50 border-indigo-500 text-indigo-700", Default: "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700" */}
							<Disclosure.Button
								as="a"
								href="#"
								className="block border-l-4 border-indigo-500 bg-indigo-50 py-2 pl-3 pr-4 text-base font-medium text-indigo-700"
							>
								Dashboard
							</Disclosure.Button>
							<Disclosure.Button
								as="a"
								href="#"
								className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700"
							>
								Team
							</Disclosure.Button>
							<Disclosure.Button
								as="a"
								href="#"
								className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700"
							>
								Projects
							</Disclosure.Button>
							<Disclosure.Button
								as="a"
								href="#"
								className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700"
							>
								Calendar
							</Disclosure.Button>
						</div>
						<div className="border-t border-gray-200 pb-3 pt-4">
							<div className="flex items-center px-4">
								<div className="flex-shrink-0">
									<img
										className="h-10 w-10 rounded-full"
										src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
										alt=""
									/>
								</div>
								<div className="ml-3">
									<div className="text-base font-medium text-gray-800">
										Tom Cook
									</div>
									<div className="text-sm font-medium text-gray-500">
										tom@example.com
									</div>
								</div>
								<button
									type="button"
									className="relative ml-auto flex-shrink-0 rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
								>
									<span className="absolute -inset-1.5" />
									<span className="sr-only">View notifications</span>
									<BellIcon className="h-6 w-6" aria-hidden="true" />
								</button>
							</div>
							<div className="mt-3 space-y-1">
								<Disclosure.Button
									as="a"
									href="#"
									className="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
								>
									Your Profile
								</Disclosure.Button>
								<Disclosure.Button
									as="a"
									href="#"
									className="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
								>
									Settings
								</Disclosure.Button>
								<Disclosure.Button
									as="a"
									href="#"
									className="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
								>
									Sign out
								</Disclosure.Button>
							</div>
						</div>
					</Disclosure.Panel>
				</>
			)}
		</Disclosure>
	);
}
