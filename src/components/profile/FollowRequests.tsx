import ButtonField from "@/common/ButtonField";
import { useUpdateFollowRequest } from "@/hooks/followRequest";
import { IAuthor, IFollowRequest } from "@/interface/thread";
import { formatDate } from "@/utils/reusableFunctions";
import { useSession } from "next-auth/react";
import Image from "next/image";
import React from "react";

interface IProps {
	followRequests: IFollowRequest[];
}

const FollowRequests = ({ followRequests }: IProps) => {
	const { data: session } = useSession();

  const { updateFollowRequest } = useUpdateFollowRequest({
    userEmail: session?.user.email as string,
  });

	const handleAccept = async (
		senderId: string,
		receiverId: string,
		status: "ACCEPTED" | "REJECTED" | "PENDING"
	) => {
    
		await updateFollowRequest({
			senderId,
			receiverId,
			status,
		});

	};

	return (
		<div className="flex flex-col divide-y-2 mt-5">
			{followRequests &&
				followRequests.length > 0 &&
				followRequests.map((request) => (
					<div key={request.id} className="flex justify-between">
						<div className="flex items-center gap-3">
							<Image
								src={request.sender.profileImage}
								alt="sender profile image"
								width={500}
								height={500}
								className="w-10 h-10 rounded-full object-cover"
							/>
							<div>
								<p className="text-sm font-semibold">
									@{request.sender.username}{" "}
									<span className="text-sm text-gray-500 font-normal">
										{formatDate(request.createdAt)}
									</span>
								</p>
								<p className="text-sm text-gray-500">Follow Request</p>
							</div>
						</div>
						<div className="flex gap-2">
							<ButtonField
								text="Accept"
								className="bg-white text-black hover:bg-white hover:text-black font-semibold text-base"
								handleFunction={() =>
									handleAccept(request.senderId, request.receiverId, "ACCEPTED")
								}
							/>
							<ButtonField
								text="Reject"
								className="bg-dark text-white hover:bg-dark hover:text-white font-semibold text-base border"
							/>
						</div>
					</div>
				))}
		</div>
	);
};

export default FollowRequests;
