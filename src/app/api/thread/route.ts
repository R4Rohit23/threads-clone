import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismaClient";
import { verifyToken } from "@/validation/verifyToken";
import { User } from "@prisma/client";
import { SENDER_SELECT } from "../config";

const updateType = ["threadLike"];

// Route for Get all threads
export async function GET() {
	try {
		const threads = await prisma.thread.findMany({
			include: {
				author: {
					select: {
						id: true,
						username: true,
						name: true,
						profileImage: true,
						bio: true,
						totalFollowers: true,
						totalFollowing: true,
					},
				},
				comments: {
					where: { parentCommentId: null },
					select: {
						id: true,
						text: true,
						sender: SENDER_SELECT,
						totalLikes: true,
						totalComments: true,
						parentCommentId: true,
						createdAt: true,
					},
				},
			},
			orderBy: {
				createdAt: "desc",
			},
		});

		return NextResponse.json({ success: true, data: threads });
	} catch (error: any) {
		console.log(error);
		return NextResponse.json({ success: false, message: error.message });
	}
}

// Route for creating a new thread
export async function POST(req: NextRequest) {
	try {
		const user = await verifyToken(req);

		const { title, thumbnails } = await req.json();

		if (!title) {
			return NextResponse.json({
				success: false,
				message: "Please Provide Title",
			});
		}

		const thread = await prisma.thread.create({
			data: {
				title,
				authorId: user.id,
				thumbnails: thumbnails,
			},
		});

		return NextResponse.json({
			success: true,
			message: "Thread added successfully",
			data: thread,
		});
	} catch (error: any) {
		console.error(error);
		return NextResponse.json({ success: false, message: error.message });
	}
}

// Route for updating thread
export async function PUT(req: NextRequest) {
	try {
		const { type, threadId } = await req.json();
		const user = await verifyToken(req);

		if (!type || !threadId) {
			return NextResponse.json({
				success: false,
				message: "Please Provide Type and Thread ID",
			});
		}

		if (!updateType.includes(type)) {
			return NextResponse.json({
				success: false,
				message: `Invalid type provided. Please provide type from ${updateType
					.toString()
					.split(",")
					.join(" ")}`,
			});
		}

		if (type == "threadLike") {
			return handleThreadLike(user, threadId);
		}
	} catch (error: any) {
		console.error(error);
		return NextResponse.json({ success: false, message: error.message });
	}
}

const handleThreadLike = async (user: User, threadId: string) => {
	try {
		const thread = await prisma.thread.findFirst({ where: { id: threadId } });

		if (!thread) {
			return NextResponse.json({
				success: false,
				message: "Thread Not Found",
			});
		}

		const isAlreadyLiked = thread.likedBy.includes(user.id);

		if (isAlreadyLiked) {
			const updatedThread = await prisma.thread.update({
				where: {
					id: threadId,
				},
				data: {
					likedBy: {
						set: thread.likedBy.filter((userId) => userId !== user.id),
					},
					totalLikes: { decrement: 1 },
				},
			});
			return NextResponse.json({
				success: true,
				message: "Thread Unliked Successfully",
				updatedThread,
			});
		} else {
			const updateThread = await prisma.thread.update({
				where: { id: threadId },
				data: {
					likedBy: {
						push: user.id,
					},
					totalLikes: {
						increment: 1,
					},
				},
			});

			return NextResponse.json({
				success: true,
				message: "Thread liked successfully",
				updateThread,
			});
		}
	} catch (error: any) {
		console.log(error);
		return NextResponse.json({ success: false, message: error.message });
	}
};
