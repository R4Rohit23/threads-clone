import { IAuthor } from "@/interface/thread";
import { APIHandler } from "@/server/ApiHandler";
import ROUTES from "@/server/Routes";
import { useQuery } from "@tanstack/react-query";

export const useGetMyConnections = ({
	type,
	username,
}: {
	type: string;
	username: string;
}) => {
	const fetchConnections = async () => {
		const { data } = await APIHandler(
			"GET",
			ROUTES.PROFILE.MY_CONNECTIONS + `/?type=${type}&username=${username}`
		);
		return data.data;
	};

	const { data, isLoading, isError, error } = useQuery<IAuthor[]>({
		queryKey: ["myConnections", type],
		queryFn: fetchConnections,
	});

	return { data, isLoading, isError, error };
};
