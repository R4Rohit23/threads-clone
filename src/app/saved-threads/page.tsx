"use client";

import Thread from "@/components/Home/Thread";
import { useGetMySavedThreads } from "@/hooks/useGetMySavedThreads";
import { IThread } from "@/interface/thread";
import React from "react";
import Loader from "@/common/Loader";
import toast from "react-hot-toast";

const SavedThread = () => {
	const { data, isLoading, isError, error } = useGetMySavedThreads();

	if (isError) {
		console.log(error);
		return toast.error("Error fetching saved threads");
	}

	return (
		<>
			{isLoading ? (
				<Loader />
			) : (
				<div className="text-white mx-auto max-w-3xl flex flex-col bg-dark-1 mt-5">
					{data?.map((thread: IThread) => (
						<Thread
							data={thread}
							key={thread.id}
							queryToInvalidate={["mySavedThreads"]}
						/>
					))}
				</div>
			)}
		</>
	);
};

export default SavedThread;
