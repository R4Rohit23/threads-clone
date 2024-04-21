import * as Yup from "yup";

export const VEmail = Yup.string()
	.email("Please Enter Valid Email")
	.required("Please Enter Email Address");

export const VPassword = Yup.string().required("Please Enter Password");

export const VName = Yup.string().required("Please Enter Name");

export const VUsername = Yup.string().required("Please Enter Username");
