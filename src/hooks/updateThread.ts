import { APIHandler } from "@/server/ApiHandler";
import ROUTES from "@/server/Routes";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

interface IUpdateThread {
	type: "threadLike" | "threadUpdate" | "threadDelete";
	threadId: string;
	title?: string;
	thumbnails?: string[];
}

export const useUpdateThread = () => {
	const queryClient = useQueryClient();
	const { data: session } = useSession();

	const threadLike = useMutation({
		mutationFn: likeThread,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["threads"] });
			queryClient.invalidateQueries({
				queryKey: ["userProfile", session?.user.username],
			});
		},
		onError: (error) => {
			toast.error(error.message ?? "Error While Liking Thread");
			console.log(error);
		},
	});

	const threadUpdate = useMutation({
		mutationFn: updateThreadFunction,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["threads"] });
			queryClient.invalidateQueries({
				queryKey: ["userProfile", session?.user.username],
			});
		},
		onError: (error) => {
			toast.error(error.message ?? "Error While Liking Thread");
			console.log(error);
		},
	});

	const updateThread = async ({
		type,
		threadId,
		title,
		thumbnails,
	}: IUpdateThread) => {
		switch (type) {
			case "threadLike":
				await threadLike.mutateAsync({ type, threadId });
				break;
			case "threadUpdate":
				await threadUpdate.mutateAsync({ type, threadId, title, thumbnails });
				break;
			case "threadDelete":
				await threadUpdate.mutateAsync({ type, threadId, title, thumbnails });
				break;
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
		throw new Error(data.message);
	} else {
		toast.success(data.message ?? "Thread Updated Successfully");
	}

	return data;
};

const updateThreadFunction = async ({
	type,
	threadId,
	title,
	thumbnails,
}: IUpdateThread) => {
	if (type === "threadUpdate") {
		const formData = new FormData();
		formData.append("threadId", threadId);
		formData.append("title", title as string);
		thumbnails &&
			thumbnails.forEach((element) => {
				formData.append("thumbnails", element);
			});

		const { data } = await APIHandler(
			"PUT",
			ROUTES.THREAD + "/update",
			formData
		);

		if (!data.success) {
			throw new Error(data.message);
		} else {
			toast.success(data.message ?? "Thread Updated Successfully");
		}

		return data;
	} else {
		const { data } = await APIHandler("DELETE", ROUTES.THREAD, { threadId: threadId});
		if (!data.success) {
            throw new Error(data.message);
        } else {
            toast.success(data.message?? "Thread Deleted Successfully");
        }
	}
};
