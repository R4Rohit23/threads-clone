import React from "react";
import { CommentComponent } from "../Home/Discussion";
import { IComments } from "@/interface/thread";

interface IProps {
	comments: IComments[];
}

const UserComments = ({ comments }: IProps) => {
	return (
		<div>
			{comments &&
				comments.length > 0 &&
				comments.map((comment) => (
					<CommentComponent isReply={false} comment={comment} threadId={comment.threadId} commentId={comment.id} key={comment.id}/>
				))}
		</div>
	);
};

export default UserComments;
