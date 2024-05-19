"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import Loader from "@/common/Loader";
import toast from "react-hot-toast";
import { checkIsImage, formatDate } from "@/utils/reusableFunctions";
import { FaArrowLeft, FaArrowRight, FaHeart } from "react-icons/fa";
import Discussion from "@/components/Home/Discussion";
import { IComments, IThread } from "@/interface/thread";
import Like from "@/common/Like";
import { useComment } from "@/hooks/addComment";
import { useGetCommentById } from "@/hooks/getCommentById";
import Comment from "@/common/Comment";

const CommentById = () => {
	const { commentId, threadId } = useParams();
	const { likeComment, isLoading } = useComment({ commentId: commentId as string });
	const [currentIndex, setCurrentIndex] = useState<number>(0);

	const { data, isLoading: commentLoading, isError, error } = useGetCommentById({
		commentId: commentId as string,
	});

	if (isError) {
		return toast.error(error?.message ?? "Error While Fetching Comment");
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
			{commentLoading ? (
				<Loader />
			) : (
				<div>
					<div className="border-b py-4 border-gray-700">
						<div className="flex gap-2 items-start w-full">
							<Image
								src={data?.sender?.profileImage as string}
								width={300}
								height={400}
								alt="Profile Image"
								className="rounded-full object-cover w-10 h-10"
							/>

							<div className="flex flex-col relative gap-2">
								<div className="flex items-center gap-2">
									<p>@{data?.sender?.username} </p>
									<p className="text-gray-400 text-sm">
										{formatDate(data?.createdAt as string)}
									</p>
								</div>
								<div>
									<p className="text-white text-base">{data?.text}</p>
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
								<div className="flex gap-5 items-center">
									<Like
										data={data}
										handleFunction={() =>
											likeComment({
												commentId: commentId as string,
											})
										}
										isLoading={isLoading}
									/>
									<Comment
										readonly
										totalComments={data?.totalComments as number}
									/>
								</div>
							</div>
						</div>
					</div>
					<Discussion
						comments={data?.subComments as IComments[]}
						type="subComment"
						commentId={commentId as string}
						threadId={threadId as string}
					/>
				</div>
			)}
		</>
	);
};

export default CommentById;
