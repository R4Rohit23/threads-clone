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
	} else if (diffDays > 1) {
		return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
	} else if (diffHours >= 1)
		return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
	else if (diffMinutes >= 1)
		return `${diffMinutes} minute${diffMinutes > 1 ? "s" : ""} ago`;
	else return "just now";
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
		return count;
	} else if (count < 1000000) {
		return `${Math.floor(count / 1000)}k`;
	} else {
		return `${Math.floor(count / 1000000)}m`;
	}
};

export const getRequestStatus = (
	requests: IFollowRequest[],
	followers: string[],
	userId: string
) => {
	const isPresentInRequest = requests?.some(
		(request) =>
			request.senderId === userId && request.status === ("PENDING" as any)
	);

	const isPresentInFollowers = followers?.some(
		(followerId) => followerId === userId
	);

	return isPresentInRequest
		? "Requested"
		: isPresentInFollowers
		? "Unfollow"
		: "Follow";
};
