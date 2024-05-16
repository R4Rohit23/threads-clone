"use client";

import ButtonField from "@/common/ButtonField";
import ErrorText from "@/common/ErrorText";
import InputField from "@/common/InputField";
import { Email, Password, Name, Username } from "@/utils/InputFields";
import { VEmail, VPassword, VName, VUsername } from "@/validation/InputField";
import { Formik } from "formik";
import React, { useRef, useState } from "react";
import { FaGoogle } from "react-icons/fa";
import * as Yup from "yup";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { APIHandler } from "@/server/ApiHandler";
import ROUTES from "@/server/Routes";
import Link from "next/link";
import { UploadButton } from "@/utils/uploadthing";

const LoginPage = () => {
	const inputFields = [Name, Username, Email, Password];
	const [uploadedImage, setUploadedImage] = useState<string>();

	const router = useRouter();

	const Validation = Yup.object().shape({
		name: VName,
		username: VUsername,
		email: VEmail,
		password: VPassword,
	});

	const imageRef = useRef<any>();

	return (
		<div className="absolute center-horizontal top-5 flex-col text-white gap-5 pb-5">
			<h1 className="heading-1 backdrop-blur-md">Register</h1>

			<Formik
				initialValues={{
					name: "",
					username: "",
					email: "",
					password: "",
				}}
				validationSchema={Validation}
				onSubmit={async (values: any, { setSubmitting }) => {
					try {
						setSubmitting(true);
						const { data } = await APIHandler(
							"POST",
							ROUTES.AUTH.REGISTER,
							{
								name: values.name,
                                username: values.username,
                                email: values.email,
                                password: values.password,
                                profileImage: uploadedImage,
							}
						);
						if (!data.success) {
							toast.error(data.message ?? "Internal Server Error");
							setSubmitting(false);
						} else {
							toast.success(data.message ?? "Successfully Registered");
							setSubmitting(false);
							signIn("credentials", {
								email: values.email,
								password: values.password,
							});
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
					<form onSubmit={handleSubmit} className="space-y-5">
						<img
							src={"/assets/user-stroke-rounded.svg"}
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
							<div className="space-y-1" key={indx}>
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
						))}

						<ButtonField
							type="submit"
							text="Submit"
							disabled={isSubmitting}
							className="gradient-btn hover:scale-110 transition-transform duration-300"
							loading={isSubmitting}
						/>

						<div className="flex items-center">
							<div className="flex-grow h-px bg-gray-500"></div>
							<span className="mx-4 text-gray-300 text-sm">or</span>
							<div className="flex-grow h-px bg-gray-500"></div>
						</div>

						<ButtonField
							text="Continue With Google"
							className="gradient-btn w-full hover:scale-110 transition-transform duration-300"
							Icon={FaGoogle}
							loading={isSubmitting}
						/>

						<div className="capitalize text-sm text-gray-400 text-center">
							already have an account. Please{" "}
							<Link href={"/login"} className="opacity-100 text-white">
								Login
							</Link>{" "}
							Here
						</div>
					</form>
				)}
			</Formik>
		</div>
	);
};

export default LoginPage;
