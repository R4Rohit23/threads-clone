// import kafka from "@/lib/kafka";
import { APIHandler } from "@/server/ApiHandler";
import ROUTES from "@/server/Routes";
import { useMutation } from "@tanstack/react-query";

interface IProps {
	receiverId: string;
	type: "THREAD_LIKE" | "THREAD_COMMENT" | "COMMENT_LIKE";
	redirectUrl: string;
}

export const useCreateNotification = () => {
	const createNotificationMutation = useMutation({
		mutationFn: createNotificationFunction,
	});

	return {
		createNotificationMutation,
	};
};

const createNotificationFunction = async (props: IProps) => {
	const { data, status } = await APIHandler("POST", ROUTES.NOTIFICATION, {
		...props,
	});

	console.log(data);

	if (!status) {
		throw new Error(data?.message);
	}

	// const producer = kafka.producer();

	// await producer.connect();

	// const result = await producer.send({
	// 	topic: "new-notification",
	// 	messages: [
	// 		{
	// 			value: data.data
	// 		},
	// 	],
	// });
	// console.log(result);
	// await producer.disconnect();
	return data.data;
};
