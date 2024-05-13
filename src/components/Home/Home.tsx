import { useGetAllThreads } from "@/hooks/getAllThreads";
import React from "react";
import Discussion from "./Discussion";
import Thread from "./Thread";
import { IThread } from "@/interface/thread";
import toast from "react-hot-toast";
import Loader from "@/common/Loader";

const HomePage = () => {
	const { data, isError, isLoading, error } = useGetAllThreads();

	if (isError) {
		console.log(error);
		return toast.error("Error While Fetching Threads");
	}

	return (
		<>
			{isLoading ? (
				<Loader />
			) : (
				<div className="text-white mx-auto max-w-3xl flex flex-col bg-dark-1">
					{data?.map((thread: IThread) => (
						<Thread data={thread} key={thread.id} />
					))}
				</div>
			)}
		</>
	);
};

export default HomePage;
