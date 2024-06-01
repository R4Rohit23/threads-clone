import React, { useEffect } from "react";
import Thread from "./Thread";
import { IThread } from "@/interface/thread";
import toast from "react-hot-toast";
import Loader from "@/common/Loader";
import { useInfiniteQuery } from "@tanstack/react-query";
import { APIHandler } from "@/server/ApiHandler";
import ROUTES from "@/server/Routes";
import { useInView } from "react-intersection-observer";

const HomePage = () => {
	const { ref, inView } = useInView();

	const {
		data,
		isError,
		isLoading,
		error,
		isFetchingNextPage,
		fetchNextPage,
		hasNextPage,
	} = useInfiniteQuery<any>({
		queryKey: ["threads"],
		queryFn: async ({ pageParam }) => {
			const { data } = await APIHandler(
				"GET",
				ROUTES.THREAD + `?cursor=${pageParam}`
			);
			return data;
		},
		initialPageParam: "",
		getNextPageParam: (lastPage) => {
			return lastPage?.data?.nextId === "" ? false : lastPage?.data?.nextId;
		},
	});

	if (isError) {
		console.log(error);
		return toast.error("Error While Fetching Threads");
	}

	useEffect(() => {
		const fetchData = () => {
		  if (inView && hasNextPage) {
			fetchNextPage();
		  }
		};
	  
		fetchData();
	  }, [inView, hasNextPage]);

	return (
		<>
			{isLoading ? (
				<Loader />
			) : (
				<div className="text-white mx-auto max-w-3xl flex flex-col bg-dark-1 mt-5">
					{data?.pages?.map((page) =>
						page?.data?.threads?.map((thread: IThread) => (
							<div key={thread.id}>
								<Thread
									data={thread}
									key={thread.id}
									queryToInvalidate={["threads"]}
								/>
							</div>
						))
					)}
					{isFetchingNextPage && (
						<div className="my-5">
							<Loader />
						</div>
					)}
					<span ref={ref} style={{ visibility: "hidden" }}>
						intersection observer marker
					</span>
				</div>
			)}
		</>
	);
};

export default HomePage;
