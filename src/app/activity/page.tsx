"use client";
import Loader from "@/common/Loader";
import FollowRequests from "@/components/profile/FollowRequests";
import { userGetUserProfile } from "@/hooks/getUserProfile";
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
	} = userGetUserProfile({ email: session?.user.email as string });

	if (!isLoading && isError) {
		console.log(error);
		return toast.error("Error While Fetching Profile");
	}

	return (
		<div>
			{isLoading ? (
				<Loader />
			) : (
				<div>
					<nav className="text-white flex items-center text-sm">
						{["Requests", "Comments"].map((nav, indx) => (
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
						<h1>Hii</h1>
					)}
				</div>
			)}
		</div>
	);
};

export default ActivityPage;
