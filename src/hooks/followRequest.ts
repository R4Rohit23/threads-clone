import { APIHandler } from "@/server/ApiHandler";
import ROUTES from "@/server/Routes";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

interface IProps {
    username?: string;
}

interface IFollowRequest {
    senderId?: string;
    receiverId?: string;
    status?: "ACCEPTED" | "REJECTED" | "PENDING";
}

export const useUpdateFollowRequest = ({username}: IProps) => {
    const queryClient = useQueryClient();

    const sendFollowRequestMutation = useMutation({
        mutationFn: sentFollowRequestFunction,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["userProfile", username]});
            queryClient.invalidateQueries({ queryKey: ["threads"]});
        },
        onError: (error) => {
            toast.error(error.message ?? "Error While sending follow request");
            console.log(error);
        },
    })

    const acceptOrRejectFollowRequest = useMutation({
		mutationFn: acceptFollowRequestFunction,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["userProfile", username]});
		},
		onError: (error) => {
			toast.error(error.message ?? "Error While accepting follow request");
			console.log(error);
		},
	});

    const unFollow = useMutation({
        mutationFn: unFollowFunction,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["userProfile", username]});
            queryClient.invalidateQueries({ queryKey: ["threads"]});
        },
        onError: (error) => {
            toast.error(error.message ?? "Error While Unfollowing");
            console.log(error);
        },
    })

    const updateFollowRequest = async ({ senderId, receiverId, status}: IFollowRequest) => {
        await acceptOrRejectFollowRequest.mutateAsync({ senderId, receiverId, status});
    }

    const sendFollowRequest = async ({ receiverId }: IFollowRequest) => {
        await sendFollowRequestMutation.mutateAsync({receiverId});
    }

    const unFollowUser = async ({ senderId, receiverId } : IFollowRequest) => {
        await unFollow.mutateAsync({senderId, receiverId});
    }

    return { updateFollowRequest, sendFollowRequest, unFollowUser };
}

const acceptFollowRequestFunction = async ({ senderId, receiverId, status}: IFollowRequest) => {
    const { data } = await APIHandler("PUT", ROUTES.FOLLOW.REQUEST, {
        senderId,
        receiverId,
        status
    });

    if (!data.success) {
        console.error(data.message);
        throw new Error(data.message);
    } 
    toast.success(`Follow Request ${status}`)
    return data;
}

const sentFollowRequestFunction = async ({ receiverId } : IFollowRequest) => {
    const { data } = await APIHandler("POST", ROUTES.FOLLOW.REQUEST, {
        receiverId,
    });

    if (!data.success) {
        console.error(data.message);
        throw new Error(data.message);
    } 
    toast.success(`Follow Request sent successfully`)
    return data;
}

const unFollowFunction = async ({ senderId, receiverId}: IFollowRequest) => {
    const { data, status, message } = await APIHandler("PUT", ROUTES.FOLLOW.FOLLOW, {
        senderId,
        receiverId,
    });

    if (!status) {
        console.error(message);
        throw new Error(message);
    } 
    toast.success(message ?? "User Unfollowed Successfully");
    return data;
}