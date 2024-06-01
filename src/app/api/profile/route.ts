import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismaClient";
import { verifyToken } from "@/validation/verifyToken";
import { SENDER_SELECT } from "../config";

export async function GET(req: NextRequest) {
	try {
		const user = await verifyToken(req);
		const { searchParams } = new URL(req.url);
		const username = searchParams.get("username");

		if (!username) {
			return NextResponse.json({
				success: false,
				message: "Username is required",
			});
		}

		// My profile
		if (user.username === username) {
			const foundUser = await prisma.user.findFirst({
				where: { username },
				select: {
					id: true,
					name: true,
					username: true,
					email: true,
					bio: true,
					profileImage: true,
					comments: {
						include: {
							sender: SENDER_SELECT,
						},
						orderBy: { createdAt: "desc" },
					},
					threads: {
						select: {
							id: true,
							author: SENDER_SELECT,
							title: true,
							thumbnails: true,
							totalLikes: true,
							totalComments: true,
							likedBy: true,
							createdAt: true,
							isPinned: true,
						},
						orderBy: [{ isPinned: "desc" }, { createdAt: "desc" }],
					},
					sentFollowRequests: {
						where: { status: "PENDING" },
						select: {
							id: true,
							receiverId: true,
							status: true,
							createdAt: true,
						},
					},
					receivedFollowRequests: {
						where: { status: "PENDING" },
						select: {
							id: true,
							senderId: true,
							sender: SENDER_SELECT,
							status: true,
							createdAt: true,
						},
					},
					followingIDs: true,
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
				where: { username },
				select: {
					id: true,
					name: true,
					username: true,
					email: true,
					bio: true,
					profileImage: true,
					comments: {
						include: {
							sender: SENDER_SELECT,
						},
						orderBy: { createdAt: "desc" },
					},
					threads: {
						select: {
							id: true,
							author: SENDER_SELECT,
							title: true,
							thumbnails: true,
							totalLikes: true,
							totalComments: true,
							likedBy: true,
							createdAt: true,
						},
						orderBy: { createdAt: "desc" },
					},
					sentFollowRequests: {
						where: { status: "PENDING" },
						select: {
							id: true,
							receiverId: true,
							status: true,
							createdAt: true,
						},
					},
					receivedFollowRequests: {
						where: { status: "PENDING" },
						select: {
							id: true,
							senderId: true,
							status: true,
							createdAt: true,
						},
					},
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
