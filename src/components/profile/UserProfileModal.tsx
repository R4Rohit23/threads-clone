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
import { IAuthor } from "@/interface/thread";
import { getRequestStatus, formatFollowCount } from "@/utils/reusableFunctions";
import { useSession } from "next-auth/react";
import Image from "next/image";
import React, { useState } from "react";

interface IProps {
	children: React.ReactNode;
	userData: IAuthor;
}

export function UserProfilePopover({ children, userData }: IProps) {
	const { data: session } = useSession();
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const { sendFollowRequest, unFollowUser } = useUpdateFollowRequest({});
	const [isLoading, setIsLoading] = useState<boolean>(false);

	console.log(userData);

	const followStatus = getRequestStatus(
		userData.receivedFollowRequests,
		userData.followedByIDs,
		session?.user.id as string
	);

	const handleFollowUnfollow = async () => {
		setIsLoading(true);
		if (followStatus === "Follow") {
			await sendFollowRequest({ receiverId: userData.id });
		} else {
			await unFollowUser({
				senderId: session?.user.id,
				receiverId: userData.id,
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
							{userData?.name}
						</h4>
						<p className="text-sm text-muted-foreground">
							@{userData?.username}
						</p>
					</div>
					<div className="justify-self-end">
						<Image
							src={userData?.profileImage}
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
						{formatFollowCount(userData?.totalFollowers)} followers{" "}
					</p>
					{session?.user.id !== userData?.id && (
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
