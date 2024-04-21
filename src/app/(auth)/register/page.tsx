"use client";

import ButtonField from "@/common/ButtonField";
import ErrorText from "@/common/ErrorText";
import InputField from "@/common/InputField";
import { Email, Password, Name, Username } from "@/utils/InputFields";
import { VEmail, VPassword, VName, VUsername } from "@/validation/InputField";
import { Formik } from "formik";
import React, { useEffect } from "react";
import { FaGoogle } from "react-icons/fa";
import * as Yup from "yup";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { APIHandler } from "@/server/ApiHandler";
import ROUTES from "@/server/Routes";

const LoginPage = () => {
	const inputFields = [Name, Username, Email, Password];
	
	const router = useRouter();

	const Validation = Yup.object().shape({
		name: VName,
		username: VUsername,
		email: VEmail,
		password: VPassword,
	});


	return (
		<div className="center-horizontal sm:-mt-80 flex-col text-white gap-5">
			<h1 className="heading-1 backdrop-blur-md">Register</h1>

			<Formik
				initialValues={{ 
                    name: "", 
                    username: "", 
                    email: "", 
                    password: "" 
                }}
				validationSchema={Validation}
				onSubmit={async (values: any, { setSubmitting }) => {
					try {
                        toast.success("I am clicked");
						setSubmitting(true);
						const { data } = await APIHandler("POST", ROUTES.AUTH.REGISTER, values);
                        console.log(data);
                        if (!data.status) {
                            toast.error(data.message ?? "Internal Server Error");
                            setSubmitting(false);
                        } else {
                            console.log(data);
                            toast.success(data.message?? "Successfully Registered");
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
						{inputFields.map((inp, indx) => (
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
					</form>
				)}
			</Formik>
		</div>
	);
};

export default LoginPage;
