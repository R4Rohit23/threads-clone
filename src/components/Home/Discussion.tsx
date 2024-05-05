"use client";

import { IComments, IThread } from "@/interface/thread";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import Image from "next/image";
import { useComment } from "@/hooks/addComment";
import { formatDate } from "@/utils/reusableFunctions";
import { FaHeart } from "react-icons/fa";
import { CiHeart } from "react-icons/ci";
import Like from "@/common/Like";

interface IProps {
	thread: IThread;
	comments: IComments[];
}

const Discussion = ({ comments, thread }: IProps) => {
	const { data: session } = useSession();
	const [comment, setComment] = useState("");
	const { addComment } = useComment({ threadId: thread.id });

	const handleSubmit = (e: any) => {
		e.preventDefault();
		addComment({
			type: "parentComment",
			threadId: thread.id,
			text: comment,
		});
		setComment("");
	};

	return (
		<section className="bg-dark-1 py-8 lg:py-16 antialiased">
			<div className="max-w-3xl mx-auto">
				<div className="flex justify-between items-center mb-6">
					<h2 className="text-lg lg:text-2xl font-bold text-white">
						Discussion ({comments.length})
					</h2>
				</div>

				<form className="mb-6" onSubmit={handleSubmit}>
					<div className="py-2 px-4 mb-4  rounded-lg rounded-t-lg border  bg-dark-2 border-gray-700 relative">
						<label htmlFor="comment" className="sr-only">
							Your comment
						</label>
						<div className="absolute top-0 -left-14">
							<Image
								src={session?.user?.profileImage as string}
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
					<button
						type="submit"
						className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-dark-2 rounded-lg focus:ring-4 focus:ring-primary-200 focus:ring-primary-900 hover:scale-105"
					>
						Post comment
					</button>
				</form>
				{comments.map((item, indx) => (
					<Comment comment={item} isReply={false} key={indx} thread={thread} />
				))}
			</div>
		</section>
	);
};

const Comment = ({
	isReply,
	comment,
	thread
}: {
	isReply: boolean;
	comment: IComments;
	thread: IThread;
}) => {
	const { data: session } = useSession();
	const { likeComment } = useComment({ threadId: thread.id});

	return (
		<article
			className={`p-6 ${isReply ? "mb-3 ml-6 lg:ml-12" : ""} text-base  ${
				isReply ? "" : "rounded-lg"
			}`}
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
				<Like
					data={comment}
					handleFunction={() => likeComment({ commentId: comment.id })}
				/>
			</div>
		</article>
	);
};

export default Discussion;
