import { Button } from "@/components/ui/button";
import React from "react";
import Spinner from "./Spinner";
import { cn } from "@/lib/utils";

interface PropButton extends HTMLButtonElement {
	iconStyle?: string;
	text: string;
	handleFunction(): any;
	width?: string;
	textColor?: string;
	padding?: string;
	Icon?: React.ElementType;
	loading?: boolean;
	type: "button" | "submit" | "reset";
	spinnerColor?: string;
}

const ButtonField: React.FC<Partial<PropButton>> = (props) => {
	const {
		handleFunction,
		iconStyle,
		text,
		className,
		width,
		textColor,
		Icon,
		padding,
		loading,
		type,
		disabled,
		spinnerColor,
	} = props;
	return (
		<div>
			<Button
				type={type}
				className={`${
					className
						? className
						: "bg-white text-black hover:bg-white hover:text-black font-semibold"
				} flex items-center gap-4 justify-center  w-full px-2`}
				onClick={handleFunction}
				disabled={loading || disabled}
			>
				{Icon && (
					<Icon
						className={`text-sm ${textColor ? textColor : "text-white"} ${
							iconStyle ? iconStyle : "w-5 h-5"
						} `}
					/>
				)}
				{loading && <Spinner color={spinnerColor as string} />}
				{text}
			</Button>
		</div>
	);
};

export default ButtonField;
