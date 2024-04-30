import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";
import prisma from "@/lib/prismaClient"

export const verifyToken = async (req: NextRequest) => {
	const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

	if (!token) {
		throw new Error("Please Provide Access Token");
	}

	const user = await prisma.user.findFirst({
		where: { email: token.email as string },
	});

	if (!user) {
		throw new Error("Invalid Access Token Provided");
	} else {
        return user;
    }
};
