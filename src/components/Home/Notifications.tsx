import Loader from "@/common/Loader";
import { useGetMyNotifications } from "@/hooks/notifications/useGetAllNotifications";
import { INotification } from "@/interface/notification";
import { formatDate } from "@/utils/reusableFunctions";
import { useSession } from "next-auth/react";
import Image from "next/image";
import React, { useState } from "react";
import toast from "react-hot-toast";

const Notifications = () => {
	const { data: session } = useSession();

	const { data, isLoading, isError, error } = useGetMyNotifications({
		page: 1,
		limit: 5,
	});

	const [notifications, setNotifications] = useState<INotification[]>(
		data?.notifications ?? []
	);

	if (isError) {
		console.log(error);
		return toast.error("Error While Fetching notifications");
	}

	// const consumer = kafka.consumer({ groupId: "main-group" });

	// const consumeNotifications = async () => {
	// 	try {
	// 		await consumer.connect();
	// 		await consumer.subscribe({
	// 			topic: "new-notification",
	// 			fromBeginning: true,
	// 		});
	// 		await consumer.run({
	// 			eachMessage: async ({ topic, partition, message }) => {
	// 				console.log(message?.value?.toString());
	// 				const newNotification = JSON.parse(message?.value?.toString() as string);
	// 				setNotifications((prev) => [...prev, newNotification]);
	// 			},
	// 		});
	// 	} catch (error) {
	// 		console.error("Error consuming messages:", error);
	// 	}
	// };

	// consumeNotifications();

	return (
		<div className="w-auto h-auto overflow-y-auto px-5">
			{isLoading ? (
				<Loader />
			) : (
				<div className="divide-y-2 divide-main-grey">
					{notifications && notifications.length > 0 ? (
						notifications.map((notification) => (
							<div key={notification.id} className="flex gap-3 py-3 w-60">
								<Image
									src={notification.sender.profileImage}
									alt="profile image"
									width={500}
									height={500}
									className="w-7 h-7 rounded-full object-cover"
								/>
								<div>
									<p className="text-sm font-bold">
										@{notification.sender.username}{" "}
										<span className="font-light">{notification.content}</span>
									</p>
									<p className="text-xs text-gray-400 text-end">
										{formatDate(notification.createdAt)}
									</p>
								</div>
							</div>
						))
					) : (
						<p className="text-sm">No Notification So Far</p>
					)}
				</div>
			)}
		</div>
	);
};

export default Notifications;
