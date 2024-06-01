import { APIHandler } from "@/server/ApiHandler";
import ROUTES from "@/server/Routes";
import { useQuery } from "@tanstack/react-query";

interface IProps {
	page: number;
}

export const useGetAllThreads = ({ page }: IProps) => {
	const fetchAllThreads = async () => {
		const { data } = await APIHandler("GET", ROUTES.THREAD + `?page=${page}`);
		return data.data;
	};

	const { data, isLoading, isError, error } = useQuery({
		queryKey: ["threads", page],
		queryFn: fetchAllThreads,
	});
	return { data, isLoading, isError, error };
};
