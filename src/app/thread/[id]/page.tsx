"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useGetThreadById } from "@/hooks/getThreadById";
import Loader from "@/common/Loader";
import toast from "react-hot-toast";
import { checkIsImage, formatDate } from "@/utils/reusableFunctions";
import { FaArrowLeft, FaArrowRight, FaHeart } from "react-icons/fa";
import { CiHeart } from "react-icons/ci";
import { useSession } from "next-auth/react";
import { useUpdateThread } from "@/hooks/updateThread";
import Discussion from "@/components/Home/Discussion";
import { IComments, IThread } from "@/interface/thread";
import Like from "@/common/Like";

const ThreadById = () => {
	const { id: threadId } = useParams();
	const { data: session } = useSession();
	const { updateThread } = useUpdateThread();
	const [currentIndex, setCurrentIndex] = useState<number>(0);

	const { data, isLoading, isError, error } = useGetThreadById({
		threadId: threadId as string,
	});

	if (isError) {
		return toast.error(error?.message ?? "Error While Fetching Thread");
	}

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
		<>
			{isLoading ? (
				<Loader />
			) : (
				<div>
					<div className="border-b py-4 border-gray-700">
						<div className="flex gap-2 items-start">
							<Image
								src={data?.author?.profileImage as string}
								width={300}
								height={400}
								alt="Profile Image"
								className="rounded-full object-cover w-10 h-10"
							/>

							<div className="flex flex-col relative">
								<div className="flex items-center gap-2">
									<p>@{data?.author?.username} </p>
									<p className="text-gray-400 text-sm">
										{formatDate(data?.createdAt as string)}
									</p>
								</div>
								<div>
									<p className="text-white text-base">{data?.title}</p>
								</div>
								<div className="flex items-center justify-center mt-2">
									{data?.thumbnails && data.thumbnails?.length > 1 && (
										<button
											className="bg-dark-2 hover:bg-gray-800 text-gray-400 font-bold p-3 rounded-full absolute -left-12"
											onClick={() => handlePrev(data.thumbnails as string[])}
										>
											<FaArrowLeft />
										</button>
									)}

									<div className="w-full overflow-hidden">
										<div
											className="flex transition-transform duration-500"
											style={{
												transform: `translateX(-${currentIndex * 100}%)`,
											}}
										>
											{data?.thumbnails?.map((src, indx) =>
												checkIsImage(src) ? (
													<img
														key={indx}
														src={src}
														alt="thumbnail"
														className="w-full h-full object-cover rounded-lg"
														loading="lazy"
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
									</div>

									{data?.thumbnails && data.thumbnails.length > 1 && (
										<button
											className="bg-dark-2 hover:bg-gray-800 text-gray-400 font-bold p-3 rounded-full absolute -right-12"
											onClick={() => handleNext(data.thumbnails as string[])}
										>
											<FaArrowRight />
										</button>
									)}
								</div>

								{/* <div>
									<button
										onClick={() =>
											updateThread({
												type: "threadLike",
												threadId: data?.id as string,
											})
										}
									>
										{data?.likedBy?.includes(session?.user.id as string) ? (
											<FaHeart className={`w-5 h-5 text-red-500`} />
										) : (
											<CiHeart className="w-6 h-6" />
										)}
									</button>
								</div>
								<div>
									<p className="text-gray-400 text-sm">
										{data?.totalLikes && data.totalLikes > 1
											? `${data?.totalLikes} likes`
											: `${data?.totalLikes} like`}
									</p>
								</div> */}
								<Like
									data={data}
									handleFunction={() =>
										updateThread({
											type: "threadLike",
											threadId: data?.id as string,
										})
									}
								/>
							</div>
						</div>
					</div>
					<Discussion
						comments={data?.comments as IComments[]}
						thread={data as IThread}
					/>
				</div>
			)}
		</>
	);
};

export default ThreadById;