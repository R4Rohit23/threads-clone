"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";

const toasterStyle = {
	style: {
		color: "white",
		background: "#333",
	},
};

export function Providers({ children }: { children: React.ReactNode }) {
	return (
		<SessionProvider>
			<Toaster toastOptions={toasterStyle} />
			{children}
		</SessionProvider>
	);
}
