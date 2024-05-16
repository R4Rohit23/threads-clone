import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import React from "react";

interface IProps {
	isOpen: boolean;
	setIsOpen: (value: boolean) => void;
	dialogTitle?: string;
	dialogDescription?: string;
	children: React.ReactNode;
}

export function DialogBox({
	isOpen,
	setIsOpen,
	dialogTitle,
	dialogDescription,
	children,
}: IProps) {
	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogContent className="sm:max-w-[425px] bg-dark-1 text-white border-[1px] border-main-grey">
				<DialogHeader>
					<DialogTitle>{dialogTitle}</DialogTitle>
					<DialogDescription>{dialogDescription}</DialogDescription>
				</DialogHeader>
				{children}
			</DialogContent>
		</Dialog>
	);
}
