import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
export { default } from "next-auth/middleware";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
	const token = await getToken({ req: request });
	const url = request.nextUrl;

	if (
		token &&
		(url.pathname.startsWith("/login") || url.pathname.startsWith("/register"))
	) {
		return NextResponse.redirect(new URL("/", request.url));
	} else if (!token && !url.pathname.startsWith("/login") && !url.pathname.startsWith("/register")) {
		return NextResponse.redirect(new URL("/login", request.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/login", "/register", "/"],
};
