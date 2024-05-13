"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";


interface PropTextField extends HTMLInputElement {
	boxWidth: string;
	label: string;
	handleFunction: (e: React.ChangeEvent<HTMLInputElement>) => void;
	handleBlur: (e: React.ChangeEvent<HTMLInputElement>) => void;
	handlePassword?: (e: React.ChangeEvent<HTMLInputElement>) => void;
	Icon?: React.ReactNode;
}

const InputField: React.FC<Partial<PropTextField>> = (props) => {
	const {
		handleFunction,
		placeholder,
		name,
		type,
		value,
		disabled,
		label,
		readOnly,
	} = props;

	const [togglePassword, setTogglePassword] = useState<boolean>(false);
	const handleToggle = () => {
		setTogglePassword(!togglePassword);
	};

	return (
		<div className="w-96 items-center  text-white relative">
			<Label htmlFor={name} className="capitalize">{label}</Label>
			<Input
				type={togglePassword ? "text" : type}
				placeholder={placeholder}
				name={name}
				value={value}
				onChange={handleFunction}
				disabled={disabled ?? false}
				className="bg-dark-2 text-white border-none"
			/>
			{type === "password" ? (
				togglePassword ? (
					<EyeIcon
						onClick={handleToggle}
						className="h-4 cursor-pointer absolute top-9 right-3"
					/>
				) : (
					<EyeSlashIcon
						onClick={handleToggle}
						className="h-4 cursor-pointer absolute top-9 right-3"
					/>
				)
			) : null}
		</div>
	);
};

export default InputField;
