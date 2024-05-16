import { verifyToken } from "@/validation/verifyToken";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismaClient";
import { APIHandler } from "@/server/ApiHandler";

// Api to create follow request
export async function POST(req: NextRequest) {
	try {
		const { id: senderId } = await verifyToken(req);
		const { receiverId } = await req.json();

		if (!receiverId) {
			return NextResponse.json({
				success: false,
				message: "Please provide Id of user to follow",
			});
		}

		const childUser = await prisma.user.findFirst({
			where: {
				id: receiverId,
			},
		});

		if (!childUser) {
			return NextResponse.json({
				success: false,
				message: "User does not exist",
			});
		}

		// Check if followRequest is created already
		const isFollowRequestExists = await prisma.followRequest.findFirst({
			where: {
				receiverId,
				senderId,
				status: "PENDING"
			},
		});

		if (isFollowRequestExists) {
			return NextResponse.json({
				success: false,
				message: "Follow Request Already Exists",
			});
		}

		const followRequest = await prisma.followRequest.create({
			data: {
				receiverId,
				senderId,
			},
			include: {
				sender: true,
				receiver: true,
			},
		});

		return NextResponse.json({
			success: true,
			message: "Follow Request Sent Successfully",
			data: followRequest,
		});
	} catch (error: any) {
		console.error(error.message);
		return NextResponse.json({ success: false, error: error.message });
	}
}

export async function PUT(req: NextRequest) {
	try {
		const { senderId, receiverId , status } = await req.json();

		if (!receiverId) {
			return NextResponse.json({
				success: false,
				message: "Please provide Id of user to follow",
			});
		}

		const childUser = await prisma.user.findFirst({
			where: {
				id: receiverId,
			},
		});

		if (!childUser) {
			return NextResponse.json({
				success: false,
				message: "User does not exist",
			});
		}

		if (status === "ACCEPTED") {
			const followRequest = await prisma.followRequest.findFirst({
				where: {
					receiverId: receiverId,
					senderId: senderId,
					status: "PENDING"
				},
			});

			// Delete the follow request if the request is already accepted or rejected
			const updateFollowRequest = await prisma.followRequest.delete({
				where: { id: followRequest?.id },
			});

			// Call the external api to follow the user
			const { status, data, message } = await APIHandler(
				"PUT",
				`${process.env.BASE_URL}/api/follow`,
				{
					senderId,
					receiverId,
				},
				{ "Content-Type": "application/json" }
			);

			if (!status) {
				throw new Error(message);
			}

			return NextResponse.json({
				success: true,
				message,
				updateFollowRequest,
				data: data.data,
			});
		} else if (status === "REJECTED") {
			const followRequest = await prisma.followRequest.findFirst({
				where: {
					receiverId: receiverId,
					senderId: senderId,
				},
			});

			const updateFollowRequest = await prisma.followRequest.delete({
				where: { id: followRequest?.id },
			});

			return NextResponse.json({
				success: true,
				message: "Follow Request Rejected Successfully",
				updateFollowRequest,
			});
		} else {
			return NextResponse.json({
				success: false,
				message: "Invalid Status Provided",
			});
		}
	} catch (error: any) {
		console.error(error.message);
		return NextResponse.json({ success: false, error: error.message });
	}
}
