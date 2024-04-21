import { Button } from "@/components/ui/button";
import React from "react";
import Spinner from "./Spinner";

interface PropButton extends HTMLButtonElement {
	iconStyle?: string;
	text: string;
	handleFunction(): any;
	width?: string;
	bgColor?: string;
	textColor?: string;
	padding?: string;
	Icon?: React.ElementType;
	loading?: boolean;
	type: "button" | "submit" | "reset";
}

const ButtonField: React.FC<Partial<PropButton>> = (props) => {
	const {
		handleFunction,
		iconStyle,
		text,
		className,
		width,
		bgColor,
		textColor,
		Icon,
		padding,
		loading,
		type,
	} = props;
	return (
		<div>
			<Button
				type={type}
				className={`${className} flex items-center gap-4 justify-center  sm:p-3 text-xs sm:text-sm  ${
					width ? width : "w-full"
				} ${padding ? padding : "px-2 py-1 sm:px-3.5 sm:py-2.5"}`}
				onClick={handleFunction}
				disabled={loading}
			>
				{Icon && (
					<Icon
						className={`text-sm ${textColor ? textColor : "text-white"} ${
							iconStyle ? iconStyle : "w-5 h-5"
						} `}
					/>
				)}
				{loading && <Spinner />}
				{text}
			</Button>
		</div>
	);
};

export default ButtonField;
