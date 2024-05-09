import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";

interface IProps {
	isOpen: boolean;
	setIsOpen: (value: boolean) => void;
	dialogTitle: string;
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
