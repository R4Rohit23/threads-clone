import { APIHandler } from "@/server/ApiHandler";
import ROUTES from "@/server/Routes";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

interface IAddComment {
	type?: "parentComment" | "subComment" | "commentLike";
	threadId?: string;
	text?: string;
	commentId?: string;
}

export const useComment = (props: IAddComment) => {
	const queryClient = useQueryClient();

	const parentComment = useMutation({
		mutationFn: addParentComment,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["threadById", props.threadId] });
		},
		onError: (error) => {
			toast.error(error.message ?? "Error While Creating Comment");
			console.log(error);
		},
	});

	const commentLike = useMutation({
		mutationFn: likeCommentFunction,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["threadById", props.threadId] });
		},
		onError: (error) => {
			toast.error(error.message ?? "Error While Liking Comment");
			console.log(error);
		},
	});

	const addComment = async ({ type, text, threadId }: IAddComment) => {
		switch (type) {
			case "parentComment":
				await parentComment.mutateAsync({ type, text, threadId });
		}
	};

	const likeComment = async ({ commentId }: IAddComment) => {
		await commentLike.mutateAsync({ commentId });
	};

	return { addComment, likeComment };
};

const addParentComment = async ({ type, text, threadId }: IAddComment) => {
	const { data } = await APIHandler("POST", ROUTES.COMMENT, {
		type,
		threadId,
		text,
	});

	if (!data.success) {
		throw new Error(data.message);
	} else {
		toast.success("Comment added successfully");
		return data;
	}

};

const likeCommentFunction = async ({ commentId }: IAddComment) => {
	const { data } = await APIHandler("PUT", ROUTES.COMMENT, {
		commentId,
	});

	console.log(data);

	if (!data.success) {
		throw new Error(data.message);
	} else {
		toast.success("Comment Liked successfully");
	}

	return data;
};
