import { APIHandler } from "@/server/ApiHandler";
import ROUTES from "@/server/Routes";
import { useQuery } from "@tanstack/react-query";

export const useGetAllThreads = () => {
	const fetchAllThreads = async () => {
		const { data } = await APIHandler("GET", ROUTES.THREAD);
		return data.data;
	};

	const { data, isLoading, isError, error } = useQuery({
		queryKey: ["threads"],
		queryFn: fetchAllThreads,
	});
	return { data, isLoading, isError, error };
};
