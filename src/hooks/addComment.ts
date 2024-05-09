import { APIHandler } from "@/server/ApiHandler";
import ROUTES from "@/server/Routes";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

interface IAddComment {
	type?: "parentComment" | "subComment" | "commentLike";
	threadId?: string;
	text?: string;
	commentId?: string;
}

export const useComment = (props: IAddComment) => {
	const queryClient = useQueryClient();
	const { data: session } = useSession();

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

	const subComment = useMutation({
		mutationFn: addSubComment,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["commentById", props.commentId] });
		},
		onError: (error) => {
			toast.error(error.message ?? "Error While Creating Comment");
			console.log(error);
		},
	});

	const commentLike = useMutation({
		mutationFn: likeCommentFunction,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["commentById", props.commentId as string] });
			queryClient.invalidateQueries({ queryKey: ["userProfile", session?.user.email]});
		},
		onError: (error) => {
			toast.error(error.message ?? "Error While Liking Comment");
			console.log(error);
		},
	});

	const addComment = async ({ type, text, threadId, commentId }: IAddComment) => {
		switch (type) {
			case "parentComment":
				await parentComment.mutateAsync({ type, text, threadId });
				break;
			case "subComment": 
				await subComment.mutateAsync({ type, text, threadId, commentId });
				break;
			default:
				break;
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

const addSubComment = async ({ type, text, threadId, commentId }: IAddComment) => {
	const { data } = await APIHandler("POST", ROUTES.COMMENT, {
		type,
		threadId,
		text,
		parentId: commentId
	});

	if (!data.success) {
		throw new Error(data.message);
	} else {
		toast.success("Comment Added Successfully");
		return data;
	}

};

const likeCommentFunction = async ({ commentId }: IAddComment) => {
	const { data } = await APIHandler("PUT", ROUTES.COMMENT, {
		commentId,
	});

	if (!data.success) {
		throw new Error(data.message);
	} else {
		toast.success(data.message ?? "Comment Updated Successfully");
	}

	return data;
};
