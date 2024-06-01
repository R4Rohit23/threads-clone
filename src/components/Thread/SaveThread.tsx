import { useSession } from "next-auth/react";
import React from "react";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";
import Spinner from "@/common/Spinner";

interface ILike {
	isLoading: boolean;
	handleFunction(): any;
	data: any;
}

const SaveThread = ({ handleFunction, data, isLoading }: ILike) => {
	const { data: session } = useSession();

	return (
		<div>
			{isLoading ? (
				<Spinner />
			) : (
				<>
					<button onClick={handleFunction}>
						{data?.savedBy?.includes(session?.user.id as string) ? (
							<FaBookmark className={`w-4 h-4 text-white`} />
						) : (
							<FaRegBookmark className="w-5 h-5 opacity-40 hover:opacity-100" />
						)}
					</button>
				</>
			)}
		</div>
	);
};

export default SaveThread;
