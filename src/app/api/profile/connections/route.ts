import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismaClient";
import { SENDER_SELECT } from "../../config";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
	try {
		const { searchParams } = req.nextUrl;
        const connectionType = ["followers", "following"];
		const type = searchParams.get("type") ?? "";
		const username = searchParams.get("username") ?? "";

		if (!username) {
			return NextResponse.json({
				success: false,
				message: "Please Provide Username"
			})
		}

		if (!connectionType.includes(type as string)) {
			return NextResponse.json({
				success: false,
				message: "Please Provide Type (followers or following)",
			});
		}

		if (type === "followers") {
			const myFollowers = await prisma.user.findFirst({
				where: {
					username,
				},
				select: {
					followedBy: SENDER_SELECT,
				},
			});

			return NextResponse.json({ success: true, data: myFollowers?.followedBy });
		} else {
			const myFollowing = await prisma.user.findFirst({
				where: {
					username,
				},
				select: {
					following: SENDER_SELECT,
				},
			});

			return NextResponse.json({ success: true, data: myFollowing?.following});
		}
	} catch (error: any) {
		console.log(error.message);
		return NextResponse.json({ success: false, message: error.message });
	}
}
