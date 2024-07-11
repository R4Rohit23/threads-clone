"use client";

import InputField from "@/common/InputField";
import React, { useEffect, useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useMutation } from "@tanstack/react-query";
import { APIHandler } from "@/server/ApiHandler";
import ROUTES from "@/server/Routes";
import { IAuthor } from "@/interface/thread";
import Loader from "@/common/Loader";
import Image from "next/image";
import ButtonField from "@/common/ButtonField";
import { useRouter } from "next/navigation";
import Link from "next/link";

const SearchPage = () => {
	const [query, setQuery] = useState<string>();
	const [searchData, setSearchData] = useState<IAuthor[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const fetchUsers = async () => {
		const { data } = await APIHandler(
			"GET",
			ROUTES.PROFILE.SEARCH_USER + `/?query=${query}`
		);
		return data.data;
	};

	const useSearchUsers = useMutation({
		mutationFn: fetchUsers,
		onSuccess: (data) => {
			setSearchData(data);
			setIsLoading(false);
		},
	});

	useEffect(() => {
		setTimeout(() => {
			useSearchUsers.mutate();
		}, 1000);
	}, [query]);

	return (
		<div className="mx-auto">
			<div className="flex gap-2 items-center px-5 max-w-sm sm:px-0 sm:w-full">
				<MagnifyingGlassIcon className="w-5 h-5" />
				<InputField
					placeholder="Type Username or name of the user..."
					handleFunction={(e) => {
						setIsLoading(true);
						setTimeout(() => {
							setQuery(e.target.value);
						}, 500);
					}}
				/>
			</div>
			{isLoading ? (
				<div className="h-[70vh]">
					<Loader />
				</div>
			) : (
				<div className="flex flex-col divide-y divide-main-grey mt-5 px-5 sm:px-0">
					{searchData && searchData.length > 0 ? (
						searchData.map((data) => (
							<UserProfile userData={data} key={data.id} />
						))
					) : !query ? (
						<p className="mx-auto text-main-grey">
							Type Something to search...
						</p>
					) : (
						<p className="mx-auto text-main-grey">{`No Users found with username ${query}`}</p>
					)}
				</div>
			)}
		</div>
	);
};

const UserProfile = ({ userData }: { userData: IAuthor }) => {
	const router = useRouter();
	return (
		<div className="py-5 flex justify-between">
			<div className="flex gap-2 items-center">
				<Image
					src={userData.profileImage}
					alt="profile image"
					width={500}
					height={500}
					className="profile"
				/>
				<div>
					<p className="text-base">@{userData.username}</p>
					<p className="text-sm text-main-grey">{userData.name}</p>
				</div>
			</div>
			<Link href={`/${userData.username}`}>
				<p className="bg-white text-black hover:bg-white hover:text-black rounded-lg text-xs p-2 font-semibold">
					View Profile
				</p>
			</Link>
		</div>
	);
};

export default SearchPage;
