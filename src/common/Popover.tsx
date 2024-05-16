import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { useEffect } from "react";

interface IProps {
	isOpen: boolean;
	setIsOpen: (value: any) => void;
	children: React.ReactNode;
	content: React.ReactNode;
}

export function PopoverComponent({
	isOpen,
	setIsOpen,
	children,
	content,
}: IProps) {
	
	return (
		<Popover open={isOpen}>
			<PopoverTrigger asChild onClick={() => setIsOpen(!isOpen)}>
				{children}
			</PopoverTrigger>
			<PopoverContent className="bg-dark-2 text-white border-none w-auto px-0">
				{content}
			</PopoverContent>
		</Popover>
	);
}
