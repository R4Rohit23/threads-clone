import { useSession } from "next-auth/react";
import React from "react";
import { CiHeart } from "react-icons/ci";
import { FaHeart } from "react-icons/fa";

interface ILike {
	handleFunction(): any;
	data: any;
}

const Like = ({ handleFunction, data }: ILike) => {
	const { data: session } = useSession();

	return (
		<div>
			<div>
				<button onClick={handleFunction}>
					{data?.likedBy?.includes(session?.user.id as string) ? (
						<FaHeart className={`w-5 h-5 text-red-500`} />
					) : (
						<CiHeart className="w-6 h-6 opacity-40 hover:opacity-100" />
					)}
				</button>
			</div>
			<div>
				<p className="text-gray-400 text-sm">
					{data?.totalLikes && data.totalLikes > 1
						? `${data?.totalLikes} likes`
						: `${data?.totalLikes} like`}
				</p>
			</div>
		</div>
	);
};

export default Like;
