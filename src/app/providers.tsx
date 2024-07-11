"use client";

import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";

import { ourFileRouter } from "@/app/api/uploadthing/core";

	import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
	import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const toasterStyle = {
	style: {
		color: "white",
		background: "#333",
	},
};

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
	return (
		<SessionProvider>
			<QueryClientProvider client={queryClient}>
				<ReactQueryDevtools initialIsOpen={false} />
				<NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
				<Toaster toastOptions={toasterStyle} />
				{children}
			</QueryClientProvider>
		</SessionProvider>
	);
}
