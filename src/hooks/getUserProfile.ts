import { IAuthor } from "@/interface/thread";
import { APIHandler } from "@/server/ApiHandler";
import ROUTES from "@/server/Routes";
import { useQuery } from "@tanstack/react-query";

interface IProps {
	email: string;
}

export const userGetUserProfile = ({ email }: IProps) => {
	const fetchProfile = async () => {
		const { data } = await APIHandler(
			"GET",
			ROUTES.PROFILE.USER_PROFILE + `?email=${email}`
		);

		return data.data;
	};

	const { data, isLoading, isError, error } = useQuery<IAuthor>({
		queryKey: ["userProfile", email],
		queryFn: fetchProfile,
	});

	return { data, isLoading, isError, error };
};

