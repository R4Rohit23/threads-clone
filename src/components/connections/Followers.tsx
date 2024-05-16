"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";
import Image from "next/image";
import { getRequestStatus } from "@/utils/reusableFunctions";
import { useGetUserProfile } from "@/hooks/getUserProfile";
import { useSession } from "next-auth/react";
import { IAuthor, IFollowRequest } from "@/interface/thread";
import ButtonField from "@/common/ButtonField";
import { useUpdateFollowRequest } from "@/hooks/followRequest";

const Followers = ({ user }: { user: IAuthor }) => {
	const { data: session } = useSession();

	const [isLoading, setIsLoading] = useState<boolean>(false);

	const { sendFollowRequest, unFollowUser } = useUpdateFollowRequest({ username: session?.user.username });

	const {
		data: parentUserData,
		isLoading: parentUserLoading,
		isError: isParentUserError,
		error: parentUserError,
	} = useGetUserProfile({ username: session?.user.username as string });

	if (!parentUserLoading && isParentUserError) {
		console.log(parentUserError);
		return toast.error("Error While Fetching Profile");
	}

	const followStatus = getRequestStatus(
		parentUserData?.sentFollowRequests as IFollowRequest[],
		parentUserData?.followingIDs as string[],
		user?.id as string
	);

	const handleFollowUnfollow = async () => {
		setIsLoading(true);
		if (followStatus === "Follow") {
			await sendFollowRequest({ receiverId: user?.id as string });
		} else {
			await unFollowUser({
				senderId: session?.user.id,
				receiverId: user?.id as string,
			});
		}
		setIsLoading(false);
	};

	return (
		<div className="max-h-[70vh] overflow-y-auto">
			<div key={user.id} className="py-5 flex justify-between items-center">
				<div className="flex gap-2 items-center">
					<Image
						src={user.profileImage}
						alt="profile image"
						width={500}
						height={500}
						className="profile"
					/>
					<div>
						<p className="text-base">@{user.username}</p>
						<p className="text-sm text-main-grey">{user.name}</p>
					</div>
				</div>
				<ButtonField
					text={followStatus}
					className="bg-white text-black hover:bg-white hover:text-black  text-xs font-semibold"
					disabled={followStatus === "Requested"}
					loading={isLoading}
					handleFunction={handleFollowUnfollow}
				/>
			</div>
		</div>
	);
};

export default Followers;
