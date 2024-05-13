import ButtonField from "@/common/ButtonField";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { useUpdateFollowRequest } from "@/hooks/followRequest";
import { useGetUserProfile } from "@/hooks/getUserProfile";
import { IAuthor, IFollowRequest } from "@/interface/thread";
import { getRequestStatus, formatFollowCount } from "@/utils/reusableFunctions";
import { useSession } from "next-auth/react";
import Image from "next/image";
import React, { useState } from "react";

interface IProps {
	children: React.ReactNode;
	userData?: IAuthor;
}

export function UserProfilePopover({ children, userData }: IProps) {
	const { data: session } = useSession();
	const { data: myProfile } = useGetUserProfile({
		username: session?.user.username as string,
	});
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const { sendFollowRequest, unFollowUser } = useUpdateFollowRequest({});
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const IS_MINE = session?.user.id === userData?.id ? true : false;

	const followStatus = getRequestStatus(
		myProfile?.sentFollowRequests as IFollowRequest[],
		myProfile?.followingIDs as string[],
		userData?.id as string
	);

	const handleFollowUnfollow = async () => {
		setIsLoading(true);
		if (followStatus === "Follow") {
			await sendFollowRequest({ receiverId: userData?.id as string });
		} else {
			await unFollowUser({
				senderId: session?.user.id,
				receiverId: userData?.id as string,
			});
		}
		setIsLoading(false);
	};

	return (
		<Popover open={isOpen}>
			<PopoverTrigger onMouseOver={() => setIsOpen(true)}>
				{children}
			</PopoverTrigger>
			<PopoverContent
				className="w-80 bg-dark-2 text-white border-none shadow-lg"
				onMouseLeave={() => setIsOpen(false)}
			>
				<div className="grid grid-cols-2 gap-4 items-center">
					<div className="space-y-1">
						<h4 className="font-medium leading-none text-lg">
							{IS_MINE ? session?.user.name : userData?.name}
						</h4>
						<p className="text-sm text-muted-foreground">
							@{IS_MINE ? session?.user.username : userData?.username}
						</p>
					</div>
					<div className="justify-self-end">
						<Image
							src={
								IS_MINE
									? (session?.user?.profileImage as string)
									: (userData?.profileImage as string)
							}
							width={500}
							height={500}
							className="w-20 h-20 rounded-full object-cover"
							alt="profile image"
						/>
					</div>
				</div>
				<div className="space-y-4 mt-2">
					<p className="text-sm ">{userData?.bio}</p>
					<p className="text-sm text-main-grey">
						{" "}
						{formatFollowCount(
							IS_MINE
								? (myProfile?.totalFollowers as number)
								: (userData?.totalFollowers as number)
						)}{" "}
						followers{" "}
					</p>
					{!IS_MINE && (
						<ButtonField
							text={followStatus}
							className="bg-white text-black hover:bg-white hover:text-black font-semibold text-base"
							disabled={followStatus === "Requested"}
							loading={isLoading}
							handleFunction={handleFollowUnfollow}
						/>
					)}
				</div>
			</PopoverContent>
		</Popover>
	);
}
