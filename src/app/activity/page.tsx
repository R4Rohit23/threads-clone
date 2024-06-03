"use client";
import Loader from "@/common/Loader";
import Activities from "@/components/profile/Activities";
import FollowRequests from "@/components/profile/FollowRequests";
import { useGetUserProfile } from "@/hooks/getUserProfile";
import { IFollowRequest } from "@/interface/thread";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import toast from "react-hot-toast";

const ActivityPage = () => {
	const [activeNav, setActiveNav] = useState<string>("Requests");
	const { data: session } = useSession();

	const {
		data: userData,
		isLoading,
		isError,
		error,
	} = useGetUserProfile({ username: session?.user.username as string });

	if (!isLoading && isError) {
		console.log(error);
		return toast.error("Error While Fetching Profile");
	}

	return (
		<div>
			{isLoading ? (
				<div className="h-[70vh]">
					<Loader />
				</div>
			) : (
				<div>
					<nav className="text-white flex items-center text-sm sticky top-20 backdrop-blur-md">
						{["Requests", "Activities"].map((nav, indx) => (
							<button
								className={`${
									activeNav === nav ? "border-b-2 border-white" : ""
								} px-28 w-1/2 py-3`}
								key={indx}
								onClick={() => setActiveNav(nav)}
							>
								{nav}
							</button>
						))}
					</nav>

					{activeNav === "Requests" ? (
						<FollowRequests
							followRequests={
								userData?.receivedFollowRequests as IFollowRequest[]
							}
						/>
					) : (
						<Activities />
					)}
				</div>
			)}
		</div>
	);
};

export default ActivityPage;
