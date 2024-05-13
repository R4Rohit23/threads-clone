import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismaClient";
import { verifyToken } from "@/validation/verifyToken";

export async function GET(req: NextRequest) {
	try {
		const { searchParams } = req.nextUrl;
		const user = await verifyToken(req);

		const query = searchParams.get("query");

		const foundUser = await prisma.user.findMany({
			where: {
				OR: [
					{ name: { contains: query || " ", mode: "insensitive" } },
					{ username: { contains: query || " ", mode: "insensitive" } },
				],
				username: {
					not: user.username
				}
			},
			select: {
				username: true,
				name: true,
				profileImage: true,
				bio: true,
				totalFollowers: true,
				totalFollowing: true,
			},
		});

		if (!foundUser) {
			return NextResponse.json({ success: false, message: "Users not found" });
		}

		return NextResponse.json({ success: true, data: foundUser });
	} catch (error: any) {
		console.error(error.message);
		return NextResponse.json({ success: false, error: error.message });
	}
}
