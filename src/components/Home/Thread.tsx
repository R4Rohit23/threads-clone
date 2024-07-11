import Like from "@/common/Like";
import { useUpdateThread } from "@/hooks/updateThread";
import { IThread } from "@/interface/thread";
import {
	checkIsImage,
	formatDate,
	formatTitle,
} from "@/utils/reusableFunctions";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { IoChatbubbleOutline } from "react-icons/io5";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { UserProfilePopover } from "../profile/UserProfileModal";
import { PopoverComponent } from "@/common/Popover";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/outline";
import { DialogBox } from "@/common/Dialog";
import EditThread from "../Thread/EditThread";
import ButtonField from "@/common/ButtonField";
import { TiPin, TiPinOutline } from "react-icons/ti";
import { useCreateNotification } from "@/hooks/notifications/useCreateNotification";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";

import { Navigation } from "swiper/modules";
import SaveThread from "../Thread/SaveThread";
import { usePathname } from "next/navigation";

interface IProps {
	data: IThread;
	queryToInvalidate: any[];
}

const Thread = ({ data, queryToInvalidate }: IProps) => {
	const { data: session } = useSession();
	const pathname = usePathname();
	const { updateThread } = useUpdateThread({
		queryToInvalidate: queryToInvalidate,
	});
	const { createNotificationMutation } = useCreateNotification();

	const [isOpen, setIsOpen] = useState<boolean>(false);
	const [isSaving, setIsSaving] = useState<boolean>(false);
	const [isLiking, setIsLiking] = useState<boolean>(false);

	const IS_MINE = session?.user.id === data.author.id;

	return (
		<div className="border-b px-4 py-4 sm:px-0 border-gray-700">
			{data.isPinned && pathname === "/profile" && (
				<p className="flex text-xs text-gray-400 gap-2 items-center mb-3 ml-5">
					<TiPinOutline className="w-5 h-5" />
					Pinned
				</p>
			)}
			<div className="flex flex-col sm:flex-row gap-2 items-start relative">
				<div className="sm:hidden flex items-center gap-2">
					<Image
						src={data?.author?.profileImage}
						width={400}
						height={400}
						alt="Profile Image"
						className="rounded-full object-cover w-8 h-8 sm:w-10 sm:h-10"
					/>
					<Link href={`/${data?.author?.username}`}>
						<UserProfilePopover userData={data.author}>
							<p>@{data?.author?.username} </p>
						</UserProfilePopover>
					</Link>

					<p className="text-gray-400 text-xs sm:text-sm">
						{formatDate(data?.createdAt)}
					</p>
				</div>
				<Image
					src={data?.author?.profileImage}
					width={400}
					height={400}
					alt="Profile Image"
					className="rounded-full object-cover w-8 h-8 sm:w-10 sm:h-10 hidden sm:block"
				/>

				<div className="flex flex-col gap-2 relative">
					<div className="hidden sm:flex items-center gap-2 text-sm sm:text-base">
						<Link href={`/${data?.author?.username}`}>
							<UserProfilePopover userData={data.author}>
								<p>@{data?.author?.username} </p>
							</UserProfilePopover>
						</Link>

						<p className="text-gray-400 text-xs sm:text-sm">
							{formatDate(data?.createdAt)}
						</p>
					</div>
					<div
						className="text-white text-sm sm:text-base"
						dangerouslySetInnerHTML={{ __html: formatTitle(data.title) }}
					/>
					{data.thumbnails && data.thumbnails?.length > 1 ? (
						<Link href={"/thread/" + data.id}>
							<Swiper
								navigation={true}
								modules={[Navigation]}
								className="sm:max-w-2xl max-w-[342px]"
							>
								{data.thumbnails?.map((src, indx) =>
									checkIsImage(src) ? (
										<SwiperSlide key={indx}>
											<img
												key={indx}
												src={src}
												alt="thumbnail"
												className="max-h-96 min-h-96 object-cover rounded-lg  w-full"
											/>
										</SwiperSlide>
									) : (
										<SwiperSlide key={indx}>
											<video
												controls
												className="w-full max-h-96 object-cover rounded-lg cursor-pointer"
												key={indx}
												loop
												muted
												onMouseEnter={(e: any) => e.target.play()}
												onMouseOut={(e: any) => e.target.pause()}
											>
												<source src={src} />
												Your browser does not support the video tag.
											</video>
										</SwiperSlide>
									)
								)}
							</Swiper>
						</Link>
					) : (
						<Link href={"/thread/" + data.id}>
							{data.thumbnails?.map((src, indx) =>
								checkIsImage(src) ? (
									<img
										key={indx}
										src={src}
										alt="thumbnail"
										className="max-h-96 object-contain rounded-lg"
									/>
								) : (
									<video
										controls
										className="w-full max-h-96 object-cover rounded-lg cursor-pointer"
										key={indx}
										loop
										muted
										onMouseEnter={(e: any) => e.target.play()}
										onMouseOut={(e: any) => e.target.pause()}
									>
										<source src={src} />
										Your browser does not support the video tag.
									</video>
								)
							)}
						</Link>
					)}

					<div className="flex gap-5 items-center">
						<Like
							handleFunction={async () => {
								setIsLiking(true);
								await updateThread({ type: "threadLike", threadId: data.id });
								setIsLiking(false);
								await createNotificationMutation.mutateAsync({
									receiverId: data.author.id,
									type: "THREAD_LIKE",
									redirectUrl: `/thread/${data.id}`,
								});
							}}
							data={data}
							isLoading={isLiking}
						/>
						<div className="flex gap-1 pb-2">
							<Link href={"/thread/" + data.id}>
								<IoChatbubbleOutline className="w-5 h-5 opacity-40 hover:opacity-100" />
							</Link>
							<p className="text-gray-400 text-sm">{data.totalComments}</p>
						</div>
						<SaveThread
							data={data}
							isLoading={isSaving}
							handleFunction={async () => {
								setIsSaving(true);
								await updateThread({ type: "threadSave", threadId: data.id });
								setIsSaving(false);
							}}
						/>
					</div>
				</div>
				{IS_MINE && (
					<PopoverComponent
						isOpen={isOpen}
						setIsOpen={setIsOpen}
						content={<EditPopover thread={data} />}
					>
						<EllipsisHorizontalIcon className="text-main-grey w-7 h-7 absolute right-0 cursor-pointer hover:text-white" />
					</PopoverComponent>
				)}
			</div>
		</div>
	);
};

export default Thread;

const EditPopover = ({ thread }: { thread: IThread }) => {
	const editPopoverContent = ["Pin To Profile", "Edit", "Delete"];
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const [activeType, setActiveType] = useState<string>();
	const [isDeleting, setIsDeleting] = useState<boolean>(false);

	const { updateThread } = useUpdateThread({
		queryToInvalidate: ["userProfile", thread.author.username],
	});

	const handleClick = (type: string) => {
		if (type === "Edit" || type === "Delete") {
			setActiveType(type);
			setIsOpen(true);
		} else {
			updateThread({
				threadId: thread.id,
				type: "threadPin",
			});
		}
	};

	const handleDeleteThread = async () => {
		setIsDeleting(true);
		await updateThread({ type: "threadDelete", threadId: thread.id });
		setIsDeleting(false);
	};

	return (
		<div className="flex flex-col gap-2 text-sm justify-start items-start w-40">
			{editPopoverContent.map((content, indx) => (
				<button
					className={`${
						indx === editPopoverContent.length - 1
							? "border-none"
							: "border-b pb-2 border-main-grey"
					} w-full text-start px-3 outline-none ${
						content === "Delete" && "text-red-600"
					}`}
					onClick={() => handleClick(content)}
					key={indx}
				>
					{content}
				</button>
			))}

			<DialogBox
				isOpen={isOpen}
				setIsOpen={setIsOpen}
				dialogTitle={activeType === "Edit" ? "Edit Thread" : "Delete Thread"}
			>
				{activeType === "Edit" ? (
					<EditThread thread={thread} setIsOpen={setIsOpen} />
				) : (
					<div className="flex flex-col gap-5">
						<h1>Do you want to delete this thread?</h1>
						<div className="flex justify-between">
							<ButtonField
								text="Cancel"
								className="bg-dark-2 hover:bg-dark-2"
								handleFunction={() => setIsOpen(false)}
							/>
							<ButtonField
								text="Delete"
								handleFunction={handleDeleteThread}
								loading={isDeleting}
								spinnerColor="black"
							/>
						</div>
					</div>
				)}
			</DialogBox>
		</div>
	);
};
