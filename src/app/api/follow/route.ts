import { verifyToken } from "@/validation/verifyToken";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismaClient";
import { SENDER_SELECT } from "../config";

export async function PUT(req: NextRequest) {
	try {
		const user = await verifyToken(req);
		const { userId } = await req.json();

		if (!userId) {
			return NextResponse.json({
				success: false,
				message: "Please provide Id of user to follow",
			});
		}

		const childUser = await prisma.user.findFirst({
			where: {
				id: userId,
			},
		});

		const isAlreadyFollowed = user.followingIDs.includes(userId);

		if (!isAlreadyFollowed) {
			// Push the followed child user id into current user's following list and increment the following count
			const updatedParentUser = await prisma.user.update({
				where: {
					id: user.id,
				},
				data: {
					followingIDs: {
						push: userId,
					},
					following: {
						connect: { id: userId },
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
				where: { id: childUser?.id },
				data: {
					totalFollowers: { increment: 1 },
				},
			});

			return NextResponse.json({
				success: true,
				message: "User followed successfully",
				updatedParentUser,
			});
		} else {
			// Remove the child user's id from parentUser following list and decrement the totalFollowing count
			const updatedParentUser = await prisma.user.update({
				where: {
					id: user.id,
				},
				data: {
					followingIDs: {
						set: user.followingIDs.filter((id) => id !== userId),
					},
					following: {
						disconnect: { id: userId },
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

			// Add the parent user's id into child user's followers list
			const updatedChildUser = await prisma.user.update({
				where: {
					id: userId,
				},
				data: {
					followedByIDs: {
						set: childUser?.followedByIDs.filter((id) => id !== user.id),
					},
					followedBy: {
						disconnect: { id: user.id },
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
				updatedParentUser,
				updatedChildUser,
			});
		}
	} catch (error: any) {
		console.log(error.message);
		return NextResponse.json({ success: false, message: error.message });
	}
}
