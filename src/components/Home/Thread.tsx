import Like from "@/common/Like";
import { useUpdateThread } from "@/hooks/updateThread";
import { IThread } from "@/interface/thread";
import { checkIsImage, formatDate } from "@/utils/reusableFunctions";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { IoChatbubbleOutline } from "react-icons/io5";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { UserProfilePopover } from "../profile/UserProfileModal";

interface IProps {
	data: IThread;
}

const Thread = ({ data }: IProps) => {
	const { data: session } = useSession();
	const { updateThread } = useUpdateThread();

	const [currentIndex, setCurrentIndex] = useState<number>(0);

	const handlePrev = (images: string[]) => {
		setCurrentIndex((prevIndex: any) =>
			prevIndex === 0 ? images.length - 1 : prevIndex - 1
		);
	};

	const handleNext = (images: string[]) => {
		setCurrentIndex((prevIndex: any) =>
			prevIndex === images.length - 1 ? 0 : prevIndex + 1
		);
	};

	return (
		<div className="border-b py-4 border-gray-700">
			<div className="flex gap-2 items-start">
				<Image
					src={data?.author?.profileImage}
					width={300}
					height={400}
					alt="Profile Image"
					className="rounded-full object-cover w-10 h-10"
				/>

				<div className="flex flex-col gap-2 relative">
					<div className="flex items-center gap-2">
						<Link href={`/${data?.author?.username}`}>
							<UserProfilePopover userData={data.author}>
								<p>@{data?.author?.username} </p>
							</UserProfilePopover>
						</Link>

						<p className="text-gray-400 text-sm">
							{formatDate(data?.createdAt)}
						</p>
					</div>
					<div>
						<p
							className="text-white text-base"
							dangerouslySetInnerHTML={{ __html: data?.title }}
						/>
					</div>
					<div className="flex items-center justify-center">
						{data.thumbnails && data.thumbnails?.length > 1 && (
							<button
								className="bg-dark-2 hover:bg-gray-800 text-gray-400 font-bold p-3 rounded-full absolute -left-12"
								onClick={() => handlePrev(data.thumbnails as string[])}
							>
								<FaArrowLeft />
							</button>
						)}

						<Link
							className="w-full overflow-hidden"
							href={"/thread/" + data.id}
						>
							<div
								className="flex transition-transform duration-500"
								style={{ transform: `translateX(-${currentIndex * 100}%)` }}
							>
								{data.thumbnails?.map((src, indx) =>
									checkIsImage(src) ? (
										<img
											key={indx}
											src={src}
											alt="thumbnail"
											className="max-w-sm max-h-96 object-cover rounded-lg"
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
							</div>
						</Link>

						{data.thumbnails && data.thumbnails.length > 1 && (
							<button
								className="bg-dark-2 hover:bg-gray-800 text-gray-400 font-bold p-3 rounded-full absolute -right-12"
								onClick={() => handleNext(data.thumbnails as string[])}
							>
								<FaArrowRight />
							</button>
						)}
					</div>
					<div className="flex gap-5">
						<Like
							handleFunction={() =>
								updateThread({ type: "threadLike", threadId: data.id })
							}
							data={data}
						/>
						<div className="space-y-2">
							<div>
								<Link href={"/thread/" + data.id}>
									<IoChatbubbleOutline className="w-5 h-5 opacity-40 hover:opacity-100" />
								</Link>
							</div>
							<div>
								<p className="text-gray-400 text-sm">
									{data?.totalComments && data.totalComments > 1
										? `${data?.totalComments} comments`
										: `${data?.totalComments} comment`}
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Thread;
