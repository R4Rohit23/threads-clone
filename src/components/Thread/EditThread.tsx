import ButtonField from "@/common/ButtonField";
import TextAreaField from "@/common/TextAreaField";
import { useUpdateThread } from "@/hooks/updateThread";
import { IThread } from "@/interface/thread";
import { checkIsImage } from "@/utils/reusableFunctions";
import { UploadDropzone } from "@/utils/uploadthing";
import { XMarkIcon } from "@heroicons/react/24/outline";
import React, { useState } from "react";

const EditThread = ({
	thread,
	setIsOpen,
}: {
	thread: IThread;
	setIsOpen: (value: any) => void;
}) => {
	const [uploadedAsset, setUploadedAsset] = useState<string[]>(
		(thread.thumbnails as string[]) || []
	);
	const [title, setTitle] = useState<string>(thread.title ?? "");
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const { updateThread } = useUpdateThread({});

	const handleDelete = async (file: string) => {
		const updatedImages = uploadedAsset.filter((item) => item !== file);
		setUploadedAsset(updatedImages);
	};

	const handleSubmit = async () => {
		setIsLoading(true);
		await updateThread({
			type: "threadUpdate",
			threadId: thread.id,
			title: title,
			thumbnails: uploadedAsset,
		});
		setIsLoading(false);
		setIsOpen(false);
	};

	return (
		<div className="flex flex-col gap-5">
			<TextAreaField
				label="Title"
				defaultValue={thread?.title}
				handleFunction={(e) => setTitle(e.target.value)}
			/>

			<h1>Thumbnail</h1>
			<div className="flex w-full">
				{uploadedAsset.length > 0 ? (
					uploadedAsset.map((thumbnail, index) => (
						<div className="relative w-full" key={index}>
							{checkIsImage(thumbnail) ? (
								<img
									src={thumbnail}
									className="w-[100%] rounded-md object-cover max-h-[400px] min-h-[400px]"
									alt="thumbnail"
								/>
							) : (
								<video
									src={thumbnail}
									controls
									className="max-h-[400px] w-full"
								/>
							)}
							<div className="absolute top-3 right-3 z-10">
								<button
									className="text-black bg-white rounded-full p-1"
									onClick={() => handleDelete(thumbnail)}
								>
									<XMarkIcon className="h-6 w-6" />
								</button>
							</div>
						</div>
					))
				) : (
					<UploadDropzone
						endpoint="imageUploader"
						config={{ mode: "auto" }}
						onClientUploadComplete={(res) => {
							setUploadedAsset((prev) => [
								...prev,
								...res.map((item) => item.url),
							]);
						}}
						onUploadError={(error: Error) => {
							console.error(`ERROR! ${error.message}`);
						}}
						className="max-h-72 pb-4 w-full"
					/>
				)}
			</div>

			<ButtonField
				text="Submit"
				handleFunction={handleSubmit}
				loading={isLoading}
				spinnerColor="black"
			/>
		</div>
	);
};

export default EditThread;
