import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismaClient";
import { verifyToken } from "@/validation/verifyToken";
import { SENDER_SELECT } from "../config";

export async function GET(req: NextRequest) {
	try {
		const user = await verifyToken(req);
		const { searchParams } = req.nextUrl;
		const userEmail = searchParams.get("email");

		if (!userEmail) {
			return NextResponse.json({
				success: false,
				message: "Email is required",
			});
		}

		if (user.email === userEmail) {
			const foundUser = await prisma.user.findFirst({
				where: { email: user.email },
				select: {
					id: true,
					name: true,
					username: true,
					email: true,
					bio: true,
					profileImage: true,
					comments: {
						include: { sender: SENDER_SELECT },
					},
					threads: {
						include: { author: SENDER_SELECT },
						orderBy: { createdAt: "desc" },
					},
					followedBy: SENDER_SELECT,
					following: SENDER_SELECT,
					sentFollowRequests: true,
					receivedFollowRequests: true,
					totalFollowers: true,
					totalFollowing: true,
				},
			});

			if (!foundUser) {
				return NextResponse.json({ success: false, message: "User not found" });
			}

			return NextResponse.json({ success: true, data: foundUser });
		} else {
			const foundUser = await prisma.user.findFirst({
				where: { email: user.email },
				select: {
					id: true,
					name: true,
					username: true,
					email: true,
					bio: true,
					profileImage: true,
					comments: {
						include: { sender: SENDER_SELECT },
					},
					threads: {
						include: { author: SENDER_SELECT },
						orderBy: { createdAt: "desc" },
					},
					followedBy: SENDER_SELECT,
					following: SENDER_SELECT,
					totalFollowers: true,
					totalFollowing: true,
				},
			});

			if (!foundUser) {
				return NextResponse.json({ success: false, message: "User not found" });
			}

			return NextResponse.json({ success: true, data: foundUser });
		}
	} catch (error: any) {
		console.log(error.message);
		return NextResponse.json({ success: false, message: error.message });
	}
}

export async function PUT(req: NextRequest) {
	try {
		const user = await verifyToken(req);
		const body = await req.json();

		if (!body) {
			return NextResponse.json({
				success: false,
				message: "No data provided",
			});
		}

		await prisma.user.update({
			where: {
				id: user.id,
			},
			data: {
				...body,
			},
		});

		return NextResponse.json({
			success: true,
			message: "User updated successfully",
		});
	} catch (error: any) {
		console.log(error.message);
		return NextResponse.json({ success: false, message: error.message });
	}
}
