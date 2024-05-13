import { IAuthor } from "@/interface/thread";
import { APIHandler } from "@/server/ApiHandler";
import ROUTES from "@/server/Routes";
import { useQuery } from "@tanstack/react-query";

interface IProps {
	username?: string;
	query?: string;
}

export const useGetUserProfile = ({ username }: IProps) => {
	const fetchProfile = async () => {
		const { data } = await APIHandler(
			"GET",
			ROUTES.PROFILE.USER_PROFILE + `?username=${username}`
		);

		return data.data;
	};

	const { data, isLoading, isError, error } = useQuery<IAuthor>({
		queryKey: ["userProfile", username],
		queryFn: fetchProfile,
	});

	return { data, isLoading, isError, error };
};

export const useSearchUser = ({ query }: IProps) => {
	const fetchUsers = async () => {
		const { data } = await APIHandler(
			"GET",
			ROUTES.PROFILE.SEARCH_USER + `/?query=${query}`
		);
		return data.data;
	};

	const { data, isLoading, isError, error } = useQuery<IAuthor>({
		queryKey: ["searchResult"],
		queryFn: fetchUsers,
	});

	return { data, isLoading, isError, error };
};
