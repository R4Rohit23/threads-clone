"use client";

import ButtonField from "@/common/ButtonField";
import { DialogBox } from "@/common/Dialog";
import Loader from "@/common/Loader";
import EditProfile from "@/components/profile/EditProfile";
import UserComments from "@/components/profile/UserComments";
import UserThreads from "@/components/profile/UserThreads";
import { userGetUserProfile } from "@/hooks/getUserProfile";
import { IAuthor, IComments, IThread } from "@/interface/thread";
import { formatFollowCount } from "@/utils/reusableFunctions";
import { useSession } from "next-auth/react";
import Image from "next/image";
import React, { useState } from "react";
import toast from "react-hot-toast";

const ProfilePage = () => {
	const { data: session } = useSession();
	const [isProfileEditOpen, setIsProfileEditOpen] = useState<boolean>(false);
	const [activeNav, setActiveNav] = useState<string>("Threads");

	const {
		data: userData,
		isLoading,
		isError,
		error,
	} = userGetUserProfile({ email: session?.user.email as string });

	if (!isLoading && isError) {
		return toast.error("Error While Fetching Profile");
	}

	console.log(userData);

	return (
		<div>
			{isLoading ? (
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
						<p className="text-main-grey">
							{" "}
							{formatFollowCount(
								userData?.totalFollowers as number
							)} followers{" "}
						</p>
						<div>
							{session?.user.id === userData?.id ? (
								<ButtonField
									text="Edit Profile"
									className="border border-main-grey bg-dark-1 hover:bg-dark-2"
									handleFunction={() => setIsProfileEditOpen(true)}
								/>
							) : (
								<ButtonField
									text="Follow"
									className="bg-white text-black hover:bg-white hover:text-black font-semibold text-base"
								/>
							)}
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
						<UserComments comments={userData?.comments as IComments[]}/>
					)}
				</div>
			)}

			<DialogBox
				isOpen={isProfileEditOpen}
				setIsOpen={setIsProfileEditOpen}
				dialogTitle="Edit Profile"
				dialogDescription="Make changes to your profile here. Click save when you're done."
				children={
					<EditProfile
						profileData={userData as IAuthor}
						close={setIsProfileEditOpen}
					/>
				}
			/>
		</div>
	);
};

export default ProfilePage;
