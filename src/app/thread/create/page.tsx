"use client";

import TextAreaField from "@/common/TextAreaField";
import { checkIsImage, getImageFromUsername } from "@/utils/reusableFunctions";
import { Formik } from "formik";
import * as Yup from "yup";
import { useSession } from "next-auth/react";
import Image from "next/image";
import React, { useState } from "react";
import ErrorText from "@/common/ErrorText";
import ButtonField from "@/common/ButtonField";
import { UploadDropzone } from "@/utils/uploadthing";
import toast from "react-hot-toast";
import { APIHandler } from "@/server/ApiHandler";
import ROUTES from "@/server/Routes";
import { useRouter } from "next/navigation";
import { XMarkIcon } from "@heroicons/react/24/outline";

const CreateThread = () => {
	const { data: session } = useSession();
	const [uploadedAsset, setUploadedAsset] = useState<string[]>([]);

	const router = useRouter();

	const Validation = Yup.object().shape({
		title: Yup.string().required("Title is required"),
	});

	console.log(uploadedAsset);

	const handleDelete = async (file: any) => {
		const updatedImages = uploadedAsset.filter((item) => item !== file);
		setUploadedAsset(updatedImages);
	};

	return (
		<main className="w-full">
			<h1 className="text-xl font-bold">Create New Thread</h1>
			<Formik
				initialValues={{
					title: "",
				}}
				validationSchema={Validation}
				onSubmit={async (values: any, { setSubmitting }) => {
					try {
						setSubmitting(true);
						const formData = new FormData();

						formData.append("title", values.title);

						uploadedAsset &&
							uploadedAsset?.forEach((element) => {
								formData.append("thumbnails", element);
							});

						const { data } = await APIHandler("POST", ROUTES.THREAD, formData);

						if (!data.success) {
							toast.error(data.message ?? "Internal Server Error");
							setSubmitting(false);
						} else {
							toast.success(data.message ?? "Thread Created Successfully");
							setSubmitting(false);
							router.push("/");
						}
					} catch (error) {
						console.log(error);
						toast.error("Internal Server Error");
						setSubmitting(false);
					}
				}}
			>
				{({
					values,
					errors,
					touched,
					handleChange,
					handleSubmit,
					isSubmitting,
				}) => (
					<div className="flex justify-between items-start w-full gap-2 p-4">
						<Image
							src={
								((session?.user.profileImage as string) ||
									(session?.user.image as string)) ??
								(session?.user &&
									getImageFromUsername(
										(session?.user?.username as string) ||
											(session.user.name as string)
									))
							}
							width={500}
							height={500}
							alt="Profile Image"
							className="rounded-full object-cover w-10 h-10"
						/>
						<div className="flex flex-col w-full gap-5">
							<p>@{session?.user?.username || session?.user?.name} </p>
							<div className="space-y-2">
								<TextAreaField
									placeholder="Write something special here..."
									name={"title"}
									handleFunction={handleChange("title") as any}
								/>
								{errors["title"] && touched["title"] && (
									<ErrorText text={errors["title"] as string} />
								)}
							</div>
							<div className="gap-5 overflow-x-auto">
								{uploadedAsset?.map((src, indx) =>
									checkIsImage(src) ? (
										<div className="relative" key={indx}>
											<Image
												src={src}
												width={500}
												height={500}
												alt="image"
												key={indx}
												className="rounded-lg pb-5 w-full max-h-72 object-contain"
											/>
											<div className="absolute top-3 right-3 z-10">
												<button
													className="text-black bg-white rounded-full p-1"
													onClick={() => handleDelete(src)}
												>
													<XMarkIcon className="h-6 w-6" />
												</button>
											</div>
										</div>
									) : (
										<video
											src={src}
											controls
											className="max-h-72 w-full"
											key={indx}
										/>
									)
								)}
							</div>

							<div>
								{/* {!uploadedAsset && ( */}
								<UploadDropzone
									endpoint="imageUploader"
									config={{ mode: "auto" }}
									onClientUploadComplete={(res) => {
										const urls = res.map((data) => data.url);
										setUploadedAsset((prev: any) => [...prev, ...urls]);
									}}
									onUploadError={(error: Error) => {
										toast.error(`ERROR! ${error.message}`);
									}}
									className="max-h-72 pb-4"
								/>
								{/* )} */}
							</div>
							<ButtonField
								text="Create Thread"
								handleFunction={handleSubmit}
								disabled={isSubmitting}
								loading={isSubmitting}
								type="submit"
								spinnerColor="black"
							/>
						</div>
					</div>
				)}
			</Formik>
		</main>
	);
};

export default CreateThread;
