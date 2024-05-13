import { IThread } from "@/interface/thread";
import React from "react";
import Thread from "../Home/Thread";

interface IProps {
	data: IThread[];
}

const UserThreads = ({ data }: IProps) => {
	return (
		<div>
			{data &&
				data.length > 0 &&
				data.map((thread) => (
					<Thread data={thread} key={thread.id} />
				))}
		</div>
	);
};

export default UserThreads;
