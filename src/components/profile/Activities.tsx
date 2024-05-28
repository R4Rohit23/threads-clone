import Loader from "@/common/Loader";
import { useGetMyNotifications } from "@/hooks/notifications/useGetAllNotifications";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import Image from "next/image";
import { formatDate } from "@/utils/reusableFunctions";
import { INotification } from "@/interface/notification";
import { APIHandler } from "@/server/ApiHandler";
import ROUTES from "@/server/Routes";

const Activities = () => {
	const [page, setPage] = useState<number>(1);
	const [notifications, setNotifications] = useState<INotification[]>([]);
	const [totalCount, setTotalCount] = useState<number>(0);
	const [isLoading, setIsLoading] = useState(false);
	const hasMore = page < Math.ceil(totalCount / 10);

	const fetchData = async () => {
		try {
			setIsLoading(true);
			const { data, status } = await APIHandler(
				"GET",
				ROUTES.NOTIFICATION + `?page=${page}`
			);

			if (!status) {
				setIsLoading(false);
				return toast.error("Error While Fetching Notifications");
			}

			setIsLoading(false);
			setTotalCount(data.data.totalCount);

			if (notifications.length == 0) {
				setNotifications(data.data.notifications);
			} else {
				setNotifications([...notifications, ...data.data.notifications]);
			}
		} catch (error) {
			console.log(error);
			return toast.error("Internal Server Error");
		}
	};

	const observerTarget = useRef(null);

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting) {
					setPage(page + 1);
				}
			},
			{ threshold: 1 }
		);

		if (observerTarget.current) {
			observer.observe(observerTarget.current);
		}

		return () => {
			if (observerTarget.current) {
				observer.unobserve(observerTarget.current);
			}
		};
	}, [observerTarget]);

	useEffect(() => {
		fetchData();
	}, [page]);

	return (
		<div className="py-5">
			{isLoading ? (
				<Loader />
			) : notifications && notifications.length > 0 ? (
				<div className="divide-y-2 divide-main-grey">
					{notifications.map((notification) => (
						<div
							key={notification.id}
							className="gap-3 flex justify-between py-5 items-center"
						>
							<div className="flex gap-3 items-center">
								<Image
									src={notification.sender.profileImage}
									alt="profile image"
									width={500}
									height={500}
									className="w-10 h-10 rounded-full object-cover"
								/>
								<p className="text-base font-semibold">
									@{notification.sender.username}{" "}
									<span className="font-light">{notification.content}</span>
								</p>
							</div>

							<div>
								<p className="text-sm text-main-grey text-end">
									{formatDate(notification.createdAt)}
								</p>
							</div>
						</div>
					))}
				</div>
			) : (
				<p className="text-main-grey text-center">No Activities so far</p>
			)}
			<div ref={observerTarget}></div>
		</div>
	);
};

export default Activities;
