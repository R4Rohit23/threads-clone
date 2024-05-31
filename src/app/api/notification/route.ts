import { NextRequest, NextResponse } from "next/server";
import { validateRequestBody } from "@/utils/apiValidations";
import common from "@/common.json";
import prisma from "@/lib/prismaClient";
import { verifyToken } from "@/validation/verifyToken";
import { SENDER_SELECT } from "../config";

export async function POST(req: NextRequest) {
	try {
		const sender = await verifyToken(req);
		const body = await req.json();
		const requiredFields = ["receiverId", "type", "redirectUrl"];
		const payload = validateRequestBody(body, requiredFields);

		if (!common.NOTIFICATION_TYPE.includes(payload.type)) {
			return NextResponse.json({
				success: false,
				message:
					"Invalid type provided. Please provide type from  " +
					common.NOTIFICATION_TYPE.toString().split(",").join(", "),
			});
		}

		const content =
			payload.type === "THREAD_LIKE"
				? " liked your thread"
				: payload.type == "COMMENT_LIKE"
				? " liked your comment"
				: " commented on your thread";

		const notification = await prisma.notification.create({
			data: {
				senderId: sender.id,
				receiverId: payload.receiverId,
				content: content,
				redirectUrl: payload.redirectUrl,
			},
			include: {
				sender: SENDER_SELECT,
			},
		});

		return NextResponse.json({
			success: true,
			message: "Notification created successfully",
			data: notification,
		});
	} catch (error: any) {
		console.log(error.message);
		return NextResponse.json({
			success: false,
			message: error.message,
		});
	}
}

export async function GET(req: NextRequest) {
	try {
		const user = await verifyToken(req);
		const { searchParams } = req.nextUrl;
		const page = parseInt(searchParams.get("page") || "1", 10);
		const limit = parseInt(searchParams.get("limit") || "10", 10);
		const skip = (page - 1) * limit;

		// Count the number of total notifications I Get
		const totalCount = await prisma.notification.aggregate({
			where: {
				receiverId: user.id,
			},
			_count: {
				_all: true,
			},
		});

		const myNotifications = await prisma.notification.findMany({
			where: {
				receiverId: user.id,
			},
			include: {
				sender: SENDER_SELECT,
			},
			orderBy: { createdAt: "desc" },
			take: limit,
			skip: skip,
		});

		return NextResponse.json({
			success: true,
			message: "Notifications fetched successfully",
			data: {
				notifications: myNotifications,
				totalCount: totalCount._count._all,
			},
		});
	} catch (error: any) {
		console.error(error.message);
		return NextResponse.json({
			success: false,
			message: error.message,
		});
	}
}
