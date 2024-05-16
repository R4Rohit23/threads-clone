import { IAuthor, IFollowRequest } from "@/interface/thread";

export function formatDate(dateString: string): string {
	const today = new Date();
	const inputDate = new Date(dateString);
	const diffMilliseconds = Math.abs(today.getTime() - inputDate.getTime());
	const diffSeconds = Math.floor(diffMilliseconds / 1000);
	const diffMinutes = Math.floor(diffSeconds / 60);
	const diffHours = Math.floor(diffMinutes / 60);
	const diffDays = Math.floor(diffHours / 24);

	if (diffDays > 7) {
		return inputDate.toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	} else if (diffDays >= 1) {
		return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
	} else if (diffHours >= 1)
		return `${diffHours} hr${diffHours > 1 ? "s" : ""} ago`;
	else if (diffMinutes >= 1)
		return `${diffMinutes} min${diffMinutes > 1 ? "s" : ""} ago`;
	else return "just now";
}

export const formatTitle = (title: string) => {
	// Replace newline characters with <br /> tags
	const formattedTitle = title.replace(/\r\n/g, '<br />');

	// Escape double quotes
	const escapedTitle = formattedTitle.replace(/"/g, '&quot;');

	return escapedTitle;
}

export const getFullName = (name: string) => {
	const splitName = name?.split(" ");
	return `${splitName[0]} ${splitName[splitName.length - 1]}`.trim();
};

export const getImageFromUsername = (username: string) => {
	const fullName = getFullName(username);
	return `https://avatars.dicebear.com/api/avataaars/${fullName}.svg`;
};

export const checkIsImage = (src: string) => {
	const fileExtension = src.split(".").pop();
	const fileTypes = ["jpg", "jpeg", "png", "webp"];

	if (fileTypes.includes(fileExtension as string)) {
		return true;
	}
	return false;
};

export const formatFollowCount = (count: number) => {
	if (count < 1000) {
		return `${count <= 2 ? count + " follower" : count + " followers"}`;
	} else if (count < 1000000) {
		return `${Math.floor(count / 1000)}k followers`;
	} else {
		return `${Math.floor(count / 1000000)}m followers`;
	}
};

export const getRequestStatus = (
	requests: IFollowRequest[],
	following: string[],
	userId: string
) => {
	// Check if child user id is present inside my sentRequests object
	const isPresentInRequest = requests?.some(
		(request) =>
			request.receiverId === userId && request.status === ("PENDING" as any)
	);

	// Check child user id is present inside my following list
	const isPresentInFollowing = following?.some(
		(followingId) => followingId === userId
	);

	return isPresentInRequest
		? "Requested"
		: isPresentInFollowing
		? "Unfollow"
		: "Follow";
};
