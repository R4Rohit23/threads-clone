import { verifyToken } from "@/validation/verifyToken";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismaClient";
import { SENDER_SELECT } from "../config";

export async function PUT(req: NextRequest) {
	try {
		const { senderId, receiverId } = await req.json();

		if (!senderId || !receiverId) {
			return NextResponse.json({
				success: false,
				message: "Please provide senderId and receiverId",
			});
		}

		const receiver = await prisma.user.findFirst({
			where: {
				id: receiverId,
			},
		});

		const sender = await prisma.user.findFirst({
			where: { id: senderId}
		});

		if (!sender || !receiver) {
			return NextResponse.json({
                success: false,
                message: "Either sender or receiver does not exist",
            });
		}

		const isAlreadyFollowed = sender.followingIDs.includes(receiverId);

		if (!isAlreadyFollowed) {
			// Push the followed child user id into current user's following list and increment the following count
			const updatedSender = await prisma.user.update({
				where: {
					id: senderId,
				},
				data: {
					followingIDs: {
						push: receiverId,
					},
					following: {
						connect: { id: receiverId },
					},
					totalFollowing: { increment: 1 },
				},
				select: {
					name: true,
					username: true,
					email: true,
					following: SENDER_SELECT,
					totalFollowing: true,
				},
			});

			// Only increment the followers count here as the parent users id is already appended to the child users followers list
			await prisma.user.update({
				where: { id: receiverId },
				data: {
					totalFollowers: { increment: 1 },
				},
			});

			return NextResponse.json({
				success: true,
				message: "User followed successfully",
				data: updatedSender,
			});
		} else {
			// Remove the child user's id from parentUser following list and decrement the totalFollowing count
			const updatedSender = await prisma.user.update({
				where: {
					id: senderId,
				},
				data: {
					followingIDs: {
						set: sender.followingIDs.filter((id) => id !== receiverId),
					},
					following: {
						disconnect: { id: receiverId },
					},
					totalFollowing: { decrement: 1 },
				},
				select: {
					name: true,
					username: true,
					email: true,
					following: SENDER_SELECT,
					totalFollowing: true,
				},
			});

			const updatedReceiver = await prisma.user.update({
				where: {
					id: receiverId,
				},
				data: {
					followedByIDs: {
						set: receiver?.followedByIDs.filter((id) => id !== senderId),
					},
					followedBy: {
						disconnect: { id: senderId },
					},
					totalFollowers: { decrement: 1 },
				},
				select: {
					name: true,
					username: true,
					email: true,
					followedBy: SENDER_SELECT,
					totalFollowers: true,
				},
			});

			return NextResponse.json({
				success: true,
				message: "User Unfollowed successfully",
				updatedSender,
				updatedReceiver,
			});
		}
	} catch (error: any) {
		console.log(error.message);
		return NextResponse.json({ success: false, message: error.message });
	}
}
