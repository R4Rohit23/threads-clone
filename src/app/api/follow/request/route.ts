import { verifyToken } from "@/validation/verifyToken";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismaClient";

export async function POST(req: NextRequest) {
	try {
		const user = await verifyToken(req);
		const { userId: childUserId } = await req.json();

		console.log("User------------------> ", user);

		if (!childUserId) {
			return NextResponse.json({
				success: false,
				message: "Please provide userId",
			});
		}

		const childUser = await prisma.user.findFirst({
			where: {
				id: childUserId,
			},
		});

		if (!childUser) {
			return NextResponse.json({
				success: false,
				message: "User does not exist",
			});
		}

		// create follow request
		const followRequest = await prisma.request.create({
			data: {
				userId: user.id,
				status: "PENDING",
			},
		});

		const updateChildUser = await prisma.user.update({
			where: {
				id: childUser.id,
			},
			data: {
				followRequests: { connect: { id: followRequest.id } },
			},
			include: {
				followRequests: true,
			},
		});

		return NextResponse.json({
			success: true,
			message: "Follow Request Sent Successfully",
			updateChildUser,
		});
	} catch (error: any) {
		console.log(error);
		return NextResponse.json({ success: false, message: error.message });
	}
}
