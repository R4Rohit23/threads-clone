import { IAuthor } from "@/interface/thread";
import React, { useState } from "react";
import Followers from "../connections/Followers";
import Following from "../connections/Following";
import { useGetMyConnections } from "@/hooks/getMyConnections";
import Loader from "@/common/Loader";
import toast from "react-hot-toast";

interface IProps {
	username: string;
}

const FollowersModal = ({ username }: IProps) => {
	const [activeNav, setActiveNav] = useState<string>("Followers");

	const { data, isError, isLoading, error } = useGetMyConnections({
		type: activeNav.toLocaleLowerCase(),
		username: username,
	});

	if (isError) {
		console.log(error);
		return toast.error("Error While Fetching Followers");
	}

	return (
		<div>
			<nav className="text-white flex items-center text-sm w-full">
				{["Followers", "Following"].map((nav, indx) => (
					<button
						className={`${
							activeNav === nav ? "border-b-2 border-white" : ""
						} w-1/2 py-3`}
						key={indx}
						onClick={() => setActiveNav(nav)}
					>
						{nav}
					</button>
				))}
			</nav>

			{activeNav === "Followers" ? (
				isLoading ? (
					<Loader />
				) : data && data.length > 0 ? (
					<div className="divide-y-2 divide-main-grey">
						{data?.map((follower) => (
							<Followers user={follower} key={follower.id} />
						))}
					</div>
				) : (
					<p className="text-main-grey mx-auto mt-5 text-center">
						{username} doesn&apos;t have any followers yet.
					</p>
				)
			) : isLoading ? (
				<Loader />
			) : data && data.length > 0 ? (
				<div className="divide-y-2 divide-main-grey">
					{data?.map((following) => (
						<Following user={following} key={following.id} />
					))}
				</div>
			) : (
				<p className="text-main-grey mx-auto mt-5 text-center">
					{username} isn&apos;t following anyone yet.
				</p>
			)}
		</div>
	);
};

export default FollowersModal;
