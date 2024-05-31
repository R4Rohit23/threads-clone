import { INotificationData } from "@/interface/notification";
import { APIHandler } from "@/server/ApiHandler";
import ROUTES from "@/server/Routes";
import { useQuery } from "@tanstack/react-query";
import { number } from "yup";

interface IProps {
	page: number;
	limit?: number;
}

export const useGetMyNotifications = ({ page, limit }: IProps) => {
	let queryParams = `?page=${page}`;

	if (limit) queryParams += `&limit=${limit}`;

	const fetchData = async () => {
		const { data } = await APIHandler("GET", ROUTES.NOTIFICATION + queryParams);
		return data.data;
	};

	const { data, isLoading, isError, error } = useQuery<INotificationData>({
		queryKey: ["myNotifications", page, limit],
		queryFn: fetchData,
	});

	return { data, isLoading, isError, error};
};
