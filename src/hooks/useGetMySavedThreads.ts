import { APIHandler } from "@/server/ApiHandler";
import ROUTES from "@/server/Routes";
import { useQuery } from "@tanstack/react-query";

export const useGetMySavedThreads = () => {
	const fetchMyThreads = async () => {
		const { data } = await APIHandler("GET", ROUTES.THREAD + "/save");
		console.log(data.data);
		return data.data;
	};

	const { data, isLoading, isError, error } = useQuery({
		queryKey: ["mySavedThreads"],
		queryFn: fetchMyThreads,
	});

    return { data, isLoading, isError, error };
};
