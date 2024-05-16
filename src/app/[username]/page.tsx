"use client";

import ButtonField from "@/common/ButtonField";
import { DialogBox } from "@/common/Dialog";
import Loader from "@/common/Loader";
import FollowersModal from "@/components/profile/FollowersModal";
import UserComments from "@/components/profile/UserComments";
import UserThreads from "@/components/profile/UserThreads";
import { useUpdateFollowRequest } from "@/hooks/followRequest";
import { useGetUserProfile } from "@/hooks/getUserProfile";
import {
	IComments,
	IFollowRequest,
	IThread,
} from "@/interface/thread";
import { formatFollowCount, getRequestStatus } from "@/utils/reusableFunctions";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";

const ProfilePage = () => {
	const { username } = useParams();
	const { data: session } = useSession();
	const [activeNav, setActiveNav] = useState<string>("Threads");
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isMyFollowersOpen, setIsMyFollowersOpen] = useState<boolean>(false);

	const { sendFollowRequest, unFollowUser } = useUpdateFollowRequest({
		username: session?.user.username as string,
	});

	const {
		data: userData,
		isLoading: userLoading,
		isError,
		error,
	} = useGetUserProfile({ username: username as string });

	const {
		data: parentUserData,
		isLoading: parentUserLoading,
		isError: isParentUserError,
		error: parentUserError,
	} = useGetUserProfile({ username: session?.user.username as string });

	if (!isLoading && isError) {
		console.log(error);
		return toast.error("Error While Fetching Profile");
	}

	if (!parentUserLoading && isParentUserError) {
		console.log(parentUserError);
		return toast.error("Error While Fetching Profile");
	}

	console.log(userData);
	console.log(parentUserData);

	const followStatus = getRequestStatus(
		parentUserData?.sentFollowRequests as IFollowRequest[],
		parentUserData?.followingIDs as string[],
		userData?.id as string
	);

	const handleFollowUnfollow = async () => {
		try {
			setIsLoading(true);
			if (followStatus === "Follow") {
				await sendFollowRequest({ receiverId: userData?.id });
			} else {
				await unFollowUser({
					senderId: session?.user.id,
					receiverId: userData?.id,
				});
			}
			setIsLoading(false);
		} catch (error) {
			console.log(error);
			setIsLoading(false);
		}
	};

	return (
		<div>
			{userLoading || parentUserLoading ? (
				<Loader />
			) : (
				<div>
					<div className="grid grid-cols-2 items-center">
						<div>
							<p className="text-2xl font-semibold">{userData?.name} </p>
							<p className="font-light">@{userData?.username} </p>
						</div>
						<div className="justify-self-end">
							<Image
								src={userData?.profileImage as string}
								width={500}
								height={500}
								alt="profile image"
								className="w-28 h-28 rounded-full object-cover"
							/>
						</div>
					</div>
					<div className="space-y-4">
						<p>{userData?.bio} </p>
						<p
							className="text-main-grey hover:underline cursor-pointer"
							onClick={() => setIsMyFollowersOpen(true)}
						>
							{formatFollowCount(userData?.totalFollowers as number)}
						</p>
						<div>
							<ButtonField
								text={followStatus}
								className="bg-white text-black hover:bg-white hover:text-black font-semibold text-sm"
								disabled={followStatus === "Requested"}
								loading={isLoading}
								handleFunction={handleFollowUnfollow}
							/>
						</div>
					</div>

					<nav className="text-white flex items-center mt-5 text-sm">
						{["Threads", "Comments"].map((nav, indx) => (
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

					{activeNav === "Threads" ? (
						<UserThreads data={userData?.threads as IThread[]} />
					) : (
						<UserComments comments={userData?.comments as IComments[]} />
					)}
				</div>
			)}

			<DialogBox isOpen={isMyFollowersOpen} setIsOpen={setIsMyFollowersOpen}>
				<FollowersModal username={userData?.username as string} />
			</DialogBox>
		</div>
	);
};

export default ProfilePage;
