"use client";

import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";

import { ourFileRouter } from "@/app/api/uploadthing/core";

const toasterStyle = {
	style: {
		color: "white",
		background: "#333",
	},
};

export function Providers({ children }: { children: React.ReactNode }) {
	return (
		<SessionProvider>
			<NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
			<Toaster toastOptions={toasterStyle} />
			{children}
		</SessionProvider>
	);
}
