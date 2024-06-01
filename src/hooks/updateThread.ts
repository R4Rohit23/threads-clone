import { APIHandler } from "@/server/ApiHandler";
import ROUTES from "@/server/Routes";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useState } from "react";
import toast from "react-hot-toast";

interface IUpdateThread {
	type?: "threadLike" | "threadUpdate" | "threadDelete" | "threadSave" | "threadPin";
	threadId?: string;
	title?: string;
	thumbnails?: string[];
	queryToInvalidate?: any;
}

export const useUpdateThread = ({ queryToInvalidate }: IUpdateThread) => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const queryClient = useQueryClient();
	const { data: session } = useSession();

	const threadLike = useMutation({
		mutationFn: likeThread,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryToInvalidate });
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

	const threadSave = useMutation({
		mutationFn: saveThreadFunction,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryToInvalidate });
		},
		onError: (error) => {
			toast.error(error.message ?? "Error While Saving Thread");
			console.log(error);
		},
	});

	const threadPin = useMutation({
		mutationFn: pinThreadFunction,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryToInvalidate });
		},
		onError: (error) => {
			toast.error(error.message ?? "Error While Saving Thread");
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
				setIsLoading(true);
				await threadLike.mutateAsync({ type, threadId });
				setIsLoading(false);
				break;
			case "threadUpdate":
				setIsLoading(true);
				await threadUpdate.mutateAsync({ type, threadId, title, thumbnails });
				setIsLoading(false);
				break;
			case "threadDelete":
				setIsLoading(true);
				await threadUpdate.mutateAsync({ type, threadId, title, thumbnails });
				setIsLoading(false);
				break;
			case "threadSave":
				setIsLoading(true);
				await threadSave.mutateAsync({ threadId });
				setIsLoading(false);
				break;
			case "threadPin":
				setIsLoading(true);
                await threadPin.mutateAsync({ threadId });
                setIsLoading(false);
                break;
		}
	};

	return { updateThread, isLoading };
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
		formData.append("threadId", threadId as string);
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
		const { data } = await APIHandler("DELETE", ROUTES.THREAD, {
			threadId: threadId,
		});
		if (!data.success) {
			throw new Error(data.message);
		} else {
			toast.success(data.message ?? "Thread Deleted Successfully");
		}
	}
};

const saveThreadFunction = async ({ threadId }: IUpdateThread) => {
	const { data } = await APIHandler("POST", ROUTES.THREAD + "/save", {
		threadId: threadId,
	});
	if (!data.success) {
		throw new Error(data.message);
	} else {
		toast.success(data?.message);
	}

	return data;
};

const pinThreadFunction = async ({ threadId }: IUpdateThread) => {
	const { data } = await APIHandler("PUT", ROUTES.THREAD + "/pin", {
		threadId: threadId,
	});
	if (!data.success) {
		throw new Error(data.message);
	} else {
		toast.success(data?.message);
	}

	return data;
};
