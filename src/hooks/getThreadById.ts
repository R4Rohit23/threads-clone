import { IThread } from "@/interface/thread";
import { APIHandler } from "@/server/ApiHandler";
import ROUTES from "@/server/Routes";
import { useQuery } from "@tanstack/react-query";

interface IProps {
	threadId: string;
}

export const useGetThreadById = ({ threadId }: IProps) => {
	const fetchThread = async () => {
		const { data } = await APIHandler(
			"GET",
			ROUTES.GET_THREAD_BY_ID + `/?id=${threadId}`
		);
		return data.data;
	};

	const { data, isLoading, isError, error } = useQuery<IThread>({
		queryKey: ["threadById", threadId],
		queryFn: fetchThread,
	});

    return { data, isLoading, isError, error };
};
