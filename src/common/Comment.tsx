import Link from "next/link";
import React from "react";
import { IoChatbubbleOutline } from "react-icons/io5";

interface IComment {
	href?: string;
	totalComments: number;
	readonly: boolean;
}

const Comment = ({ href, totalComments, readonly }: IComment) => {
	return (
		<div>
			{readonly ? (
				<button>
					<IoChatbubbleOutline className="w-5 h-5 opacity-40 hover:opacity-100" />
				</button>
			) : (
				<button>
					<Link href={href as string}>
						<IoChatbubbleOutline className="w-5 h-5 opacity-40 hover:opacity-100" />
					</Link>
				</button>
			)}
			<div>
				<p className="text-gray-400 text-sm">
					{totalComments && totalComments > 1
						? `${totalComments} comments`
						: `${totalComments} comment`}
				</p>
			</div>
		</div>
	);
};

export default Comment;
