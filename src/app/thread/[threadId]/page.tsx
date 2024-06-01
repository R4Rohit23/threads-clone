"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useGetThreadById } from "@/hooks/getThreadById";
import Loader from "@/common/Loader";
import toast from "react-hot-toast";
import Discussion from "@/components/Home/Discussion";
import { IComments, IThread } from "@/interface/thread";
import Thread from "@/components/Home/Thread";

const ThreadById = () => {
	const { threadId } = useParams();

	const {
		data,
		isLoading: isThreadLoading,
		isError,
		error,
	} = useGetThreadById({
		threadId: threadId as string,
	});

	if (isError) {
		return toast.error(error?.message ?? "Error While Fetching Thread");
	}

	return (
		<>
			{isThreadLoading ? (
				<div className="h-[80vh]">
					<Loader />
				</div>
			) : (
				<>
					<Thread
						data={data as IThread}
						queryToInvalidate={["threadById", threadId]}
					/>
					<Discussion
						comments={data?.comments as IComments[]}
						thread={data as IThread}
						threadId={data?.id}
						type="parentComment"
					/>
				</>
			)}
		</>
	);
};

export default ThreadById;
