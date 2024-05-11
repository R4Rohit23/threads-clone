"use client";

import ButtonField from "@/common/ButtonField";
import ErrorText from "@/common/ErrorText";
import InputField from "@/common/InputField";
import { Email, Password } from "@/utils/InputFields";
import { VEmail, VPassword } from "@/validation/InputField";
import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { FaGoogle } from "react-icons/fa";
import * as Yup from "yup";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";

const LoginPage = () => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const router = useRouter();
	
	const inputFields = [Email, Password];

	const Validation = Yup.object().shape({
		email: VEmail,
		password: VPassword,
	});

	return (
		<div className="center-horizontal sm:-mt-40 flex-col text-white gap-5">
			<h1 className="heading-1">Login</h1>
			<Formik
				initialValues={{ email: "", password: "" }}
				validationSchema={Validation}
				onSubmit={async (values: any, { setSubmitting }) => {
					try {
						setSubmitting(true);
						const result = await signIn("credentials", {
							email: values.email,
							password: values.password,
							callbackUrl: "/",
							redirect: false
						});
						
						if (!result?.ok) {
							toast.error(result?.error ?? "Internal Server Error")
							setSubmitting(false);
						} else {
							setSubmitting(false);
							toast.success("Successfully Logged In");
							router.push("/");
						}

					} catch (error) {
						console.log(error);
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
							loading={isSubmitting}
						/>

						<div className="flex items-center">
							<div className="flex-grow h-px bg-gray-500"></div>
							<span className="mx-4 text-gray-300 text-sm">or</span>
							<div className="flex-grow h-px bg-gray-500"></div>
						</div>

						<ButtonField
							type="button"
							text="Continue With Google"
							loading={isLoading}
							Icon={FaGoogle}
							handleFunction={async () => {
								setIsLoading(true);
								await signIn("google", {
                                    callbackUrl: "/",
                                    redirect: false
                                });
								setIsLoading(false);
							}}
						/>

						<div className="capitalize text-sm text-gray-400 text-center">
							don{`&apos`} t have an account. Please <Link href={"/register"} className="opacity-100 text-white">Register</Link>Here
						</div>
					</form>
				)}
			</Formik>
		</div>
	);
};

export default LoginPage;
