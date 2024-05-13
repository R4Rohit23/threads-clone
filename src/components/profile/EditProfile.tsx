import ButtonField from "@/common/ButtonField";
import ErrorText from "@/common/ErrorText";
import InputField from "@/common/InputField";
import { Bio, Name, Username } from "@/utils/InputFields";
import { VName, VUsername, VEmail, VPassword } from "@/validation/InputField";
import { UploadButton } from "@/utils/uploadthing";
import { Formik } from "formik";
import React, { useRef, useState } from "react";
import toast from "react-hot-toast";
import * as Yup from "yup";
import TextAreaField from "@/common/TextAreaField";
import { IAuthor } from "@/interface/thread";
import { APIHandler } from "@/server/ApiHandler";
import ROUTES from "@/server/Routes";
import { useQueryClient } from "@tanstack/react-query";

interface IProps {
	profileData: IAuthor;
    close: (value: any) => void;
}

const EditProfile = ({ profileData, close }: IProps) => {
	const inputFields = [Name, Username, Bio];
	const [uploadedImage, setUploadedImage] = useState<string>(
		profileData.profileImage
	);

	const Validation = Yup.object().shape({
		name: VName,
		username: VUsername,
	});

	const queryClient = useQueryClient();

	const imageRef = useRef<any>();
	return (
		<div>
			<div className="grid gap-4 py-4">
				<div className="grid grid-cols-4 items-center gap-4 h-[70vh] overflow-x-hidden overflow-y-auto">
					<Formik
						initialValues={{
							name: profileData.name ?? "",
							username: profileData.username ?? "",
							bio: profileData.bio ?? "",
						}}
						validationSchema={Validation}
						onSubmit={async (values: any, { setSubmitting }) => {
							try {
								setSubmitting(true);
								const { data } = await APIHandler(
									"PUT",
									ROUTES.PROFILE.USER_PROFILE,
									{
										name: values.name,
										username: values.username,
										profileImage: uploadedImage,
										bio: values.bio,
									}
								);
								if (!data.success) {
									toast.error(data.message ?? "Internal Server Error");
									setSubmitting(false);
								} else {
									queryClient.invalidateQueries({
										queryKey: ["userProfile", profileData.username],
									});
									toast.success(data.message ?? "Successfully Registered");
									setSubmitting(false);
                                    close(false);
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
							<form onSubmit={handleSubmit} className="space-y-5 col-span-4">
								<img
									src={
										profileData.profileImage ??
										"/assets/user-stroke-rounded.svg"
									}
									className="border-2 border-white bg-dark-2 rounded-full w-28 h-28 mx-auto object-cover p-3"
									ref={imageRef}
								/>

								<UploadButton
									endpoint="imageUploader"
									onClientUploadComplete={(res) => {
										imageRef.current.src = res[0].url;
										setUploadedImage(res[0].url);
									}}
									onUploadError={(error: Error) => {
										toast.error(`ERROR! ${error.message}`);
									}}
								/>

								{inputFields.map((inp, indx) => (
									<div key={indx}>
										{inp.name === "bio" ? (
											<div className="space-y-1">
												<TextAreaField
													key={indx}
													name={inp.name}
													type={inp.type}
													placeholder={inp.placeholder}
													value={values[inp.name]}
													disabled={isSubmitting}
													handleFunction={handleChange(inp.name)}
													label={inp.label}
												/>

												{errors[inp.name] && touched[inp.name] && (
													<ErrorText text={errors[inp.name] as string} />
												)}
											</div>
										) : (
											<div className="space-y-1">
												<InputField
													key={indx}
													name={inp.name}
													type={inp.type}
													placeholder={inp.placeholder}
													value={values[inp.name]}
													disabled={isSubmitting}
													handleFunction={handleChange(inp.name)}
													label={inp.name}
												/>

												{errors[inp.name] && touched[inp.name] && (
													<ErrorText text={errors[inp.name] as string} />
												)}
											</div>
										)}
									</div>
								))}

								<ButtonField
									type="submit"
									text="Submit"
									disabled={isSubmitting}
									className="gradient-btn hover:scale-110 transition-transform duration-300"
									loading={isSubmitting}
								/>
							</form>
						)}
					</Formik>
				</div>
				<div className="grid grid-cols-4 items-center gap-4">
					{/* <Label htmlFor="username" className="text-right">
						Username
					</Label>
					<Input
						id="username"
						defaultValue="@peduarte"
						className="col-span-3"
					/> */}
				</div>
			</div>
		</div>
	);
};

export default EditProfile;
