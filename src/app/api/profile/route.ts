import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismaClient";
import { verifyToken } from "@/validation/verifyToken";
import { SENDER_SELECT } from "../config";

export async function GET(req: NextRequest) {
	try {
		const user = await verifyToken(req);
		const { searchParams } = req.nextUrl;
		const username = searchParams.get("username");

		if (!username) {
			return NextResponse.json({
				success: false,
				message: "Username is required",
			});
		}

		if (user.username == username) {
			const foundUser = await prisma.user.findFirst({
				where: { id: user.id },
				select: {
					id: true,
					name: true,
					username: true,
					email: true,
					bio: true,
					profileImage: true,
					comments: true,
					threads: true,
					followedBy: SENDER_SELECT,
					following: SENDER_SELECT,
					followRequests: true,
					totalFollowers: true,
					totalFollowing: true,
				},
			});
			return NextResponse.json({ success: true, data: foundUser });
		} else {
			const foundUser = await prisma?.user.findFirst({
				where: {
					username: username,
				},
				select: {
					id: true,
					name: true,
					username: true,
					email: true,
					bio: true,
					profileImage: true,
					comments: true,
					threads: true,
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

		const updatedUser = await prisma.user.update({
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
			data: updatedUser,
		});
	} catch (error: any) {
		console.log(error.message);
		return NextResponse.json({ success: false, message: error.message });
	}
}