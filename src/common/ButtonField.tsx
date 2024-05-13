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
		disabled
	} = props;
	return (
		<div>
			<Button
				type={type}
				// className={`${className ? className : "gradient-btn"} flex items-center gap-4 justify-center  sm:p-3 text-xs sm:text-sm  ${
				// 	width ? width : "w-full"
				// } ${padding ? padding : "px-2 py-1 sm:px-3.5 sm:py-1"}`}
				className={cn(className, "flex items-center gap-4 justify-center  w-full px-2")}
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
				{loading && <Spinner />}
				{text}
			</Button>
		</div>
	);
};

export default ButtonField;
