"use client";

import { IComments, IThread } from "@/interface/thread";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import Image from "next/image";
import { useComment } from "@/hooks/addComment";
import { formatDate } from "@/utils/reusableFunctions";
import Like from "@/common/Like";

import Comment from "@/common/Comment";
import ButtonField from "@/common/ButtonField";
import { useCreateNotification } from "@/hooks/notifications/useCreateNotification";

interface IProps {
	thread?: IThread;
	threadId?: string;
	comments: IComments[];
	commentId?: string;
	type: "parentComment" | "subComment";
}

const Discussion = ({
	comments,
	thread,
	type,
	commentId,
	threadId,
}: IProps) => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const { data: session } = useSession();
	const [comment, setComment] = useState("");
	const { addComment } = useComment({
		threadId: thread?.id,
		commentId: commentId,
	});

	const { createNotificationMutation } = useCreateNotification();

	const handleSubmit = async (e: any) => {
		e.preventDefault();
		setIsLoading(true);

		if (type === "parentComment") {
			await addComment({
				type: "parentComment",
				threadId: thread?.id,
				text: comment,
			});
			await createNotificationMutation.mutateAsync({
				receiverId: thread?.author.id as string,
				type: "THREAD_COMMENT",
				redirectUrl: `/thread/${thread?.id}`
			})
		} else {
			await addComment({
				type: "subComment",
				threadId: threadId,
				text: comment,
				commentId: commentId,
			});
		}

		setComment("");
		setIsLoading(false);
	};

	return (
		<section className="bg-dark-1 py-8 lg:py-16 antialiased">
			<div className="max-w-3xl mx-auto">
				<div className="flex justify-between items-center mb-6">
					<h2 className="text-lg lg:text-xl font-bold text-white">
						Discussion ({thread?.totalComments ?? comments?.length})
					</h2>
				</div>

				<form className="mb-6" onSubmit={handleSubmit}>
					<div className="py-2 px-4 mb-4  rounded-lg rounded-t-lg border  bg-dark-2 border-gray-700 relative">
						<label htmlFor="comment" className="sr-only">
							Your comment
						</label>
						<div className="absolute top-0 -left-14">
							<Image
								src={
									(session?.user?.profileImage as string) ||
									(session?.user.image as string)
								}
								width={300}
								height={400}
								alt="Profile Image"
								className="rounded-full object-cover w-10 h-10"
							/>
						</div>
						<textarea
							id="comment"
							rows={6}
							className="px-0 w-full text-sm  border-0 focus:ring-0 focus:outline-none text-white placeholder-gray-400 bg-dark-2"
							placeholder="Write a comment..."
							required
							value={comment}
							onChange={(e) => setComment(e.target.value)}
						/>
					</div>
					<ButtonField
						type="submit"
						text="Post Comment"
						loading={isLoading}
						spinnerColor="black"
					/>
				</form>
				<div className="flex flex-col ">
					{comments.map((item, indx) => (
						<CommentComponent
							comment={item}
							isReply={false}
							key={indx}
							thread={thread}
							threadId={threadId}
							commentId={commentId}
						/>
					))}
				</div>
			</div>
		</section>
	);
};

export const CommentComponent = ({
	isReply,
	comment,
	thread,
	threadId,
}: {
	isReply: boolean;
	comment: IComments;
	thread?: IThread;
	threadId?: string;
	commentId?: string;
}) => {
	const { likeComment, isLoading } = useComment({
		queryToInvalidate: ["threadById", thread?.id],
	});

	const { createNotificationMutation } = useCreateNotification();

	return (
		<article
			className={`p-6 ${isReply ? "mb-3 ml-6 lg:ml-12" : ""} text-base  ${
				isReply ? "" : ""
			} border-b border-gray-700`}
		>
			<footer className="flex justify-between items-center mb-2">
				<div className="flex items-center">
					<p className="inline-flex items-center mr-3 text-sm text-white font-semibold">
						<img
							className="mr-2 w-6 h-6 rounded-full object-cover"
							src={comment.sender.profileImage}
							alt="Profile"
						/>
						@{comment.sender.username}
					</p>
					<p className="text-sm text-gray-400">
						{formatDate(comment.createdAt)}
					</p>
				</div>
			</footer>
			<div className="border-l-2 border-gray-600 pl-5 ml-3 flex flex-col gap-5">
				<p className="text-gray-400 ">{comment.text}</p>
				<div className="flex gap-5 items-center">
					<Like
						data={comment}
						handleFunction={async () => {
							await likeComment({ commentId: comment.id });
							await createNotificationMutation.mutateAsync({
								receiverId: comment.sender.id,
								type: "COMMENT_LIKE",
								redirectUrl: `/comment/${comment.id}`,
							});
						}}
						isLoading={isLoading}
					/>
					<Comment
						href={"/thread/" + threadId + "/comment/" + comment.id}
						totalComments={comment.totalComments}
						readonly={false}
					/>
				</div>
			</div>
		</article>
	);
};

export default Discussion;
