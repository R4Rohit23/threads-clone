import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismaClient";

export async function GET(req: NextRequest) {
	try {
		const { searchParams } = req.nextUrl;
		const query = searchParams.get("query");
		console.log(query);

		const foundUser = await prisma.user.findMany({
			where: {
				OR: [
					{ name: { contains: query || " ", mode: "insensitive" } },
					{ username: { contains: query || " ", mode: "insensitive" } },
				],
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
