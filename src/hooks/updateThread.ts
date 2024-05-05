import { APIHandler } from "@/server/ApiHandler";
import ROUTES from "@/server/Routes";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

interface IUpdateThread {
	type: "threadLike";
	threadId: string;
}

export const useUpdateThread = () => {
	const queryClient = useQueryClient();

	const threadLike = useMutation({
		mutationFn: likeThread,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["threads"] });
		},
		onError: (error) => {
			toast.error(error.message ?? "Error While Liking Thread");
			console.log(error);
		},
	});

	const updateThread = async ({ type, threadId }: IUpdateThread) => {
		switch (type) {
			case "threadLike":
				await threadLike.mutateAsync({ type, threadId });
		}
	};

	return { updateThread };
};

const likeThread = async ({ type, threadId }: IUpdateThread) => {
	const { data } = await APIHandler("PUT", ROUTES.THREAD, {
		type: type,
		threadId: threadId,
	});

    if (!data.success) {
        throw new Error(data.message)
    } else {
        toast.success("Thread Liked");
    }

	return data;
};