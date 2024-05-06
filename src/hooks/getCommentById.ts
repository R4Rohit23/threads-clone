import { IComments, IThread } from "@/interface/thread";
import { APIHandler } from "@/server/ApiHandler";
import ROUTES from "@/server/Routes";
import { useQuery } from "@tanstack/react-query";

interface IProps {
	commentId: string;
}

export const useGetCommentById = ({ commentId }: IProps) => {
	const fetchComment = async () => {
		const { data } = await APIHandler(
			"GET",
			ROUTES.COMMENT + `/?id=${commentId}`
		);
		return data.data;
	};

	const { data, isLoading, isError, error } = useQuery<IComments>({
		queryKey: ["commentById", commentId],
		queryFn: fetchComment,
	});

    return { data, isLoading, isError, error };
};
