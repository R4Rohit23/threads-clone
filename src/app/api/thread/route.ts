import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismaClient";
import { verifyToken } from "@/validation/verifyToken";
import { User } from "@prisma/client";
import { SENDER_SELECT } from "../config";
const updateType = ["threadLike", "threadUpdate"];

// Route for Get all threads
export async function GET(req: NextRequest) {
	const limit = 5;

	// Cursor-based pagination uses cursor and take to return a limited set of results before or after a given cursor
	const { searchParams } = req.nextUrl;
	const query = searchParams.get("cursor") as string;
	const cursor = query === "false" ? "" : query;
	const cursorObj = cursor === "" ? undefined : { id: cursor as string };

	try {
		let threads: any[] = [];

		if (query !== "false") {
			threads = await prisma.thread.findMany({
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
				take: limit,
				cursor: cursorObj,
				skip: cursor === "" ? 0 : 1, // skip the cursor
			});
		}

		return NextResponse.json({
			success: true,
			data: {
				threads,
				nextId: threads.length === limit ? threads[limit - 1].id : undefined, // send the next cursor in the response
			},
		});
	} catch (error: any) {
		console.log(error);
		return NextResponse.json({ success: false, message: error.message });
	}
}

// Route for creating a new thread
export async function POST(req: NextRequest) {
	try {
		const user = await verifyToken(req);

		const formData = await req.formData();

		const title = formData.get("title")?.toString() ?? undefined;
		const thumbnailsFromFormData = formData.getAll("thumbnails");
		const thumbnails = thumbnailsFromFormData.map((value) => value.toString());

		if (!title) {
			return NextResponse.json({
				success: false,
				message: "Please Provide Title",
			});
		}

		const thread = await prisma.thread.create({
			data: {
				title: title,
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

// Route for deleting thread
export async function DELETE(req: NextRequest) {
	try {
		const { threadId } = await req.json();
		const user = await verifyToken(req);

		if (!threadId) {
			return NextResponse.json({
				success: false,
				message: "Please Provide Thread ID",
			});
		}

		const thread = await prisma.thread.findFirst({ where: { id: threadId } });

		if (!thread) {
			return NextResponse.json({
				success: false,
				message: "Thread Not Found",
			});
		}

		if (thread.authorId !== user.id) {
			return NextResponse.json({
				success: false,
				message: "You are not authorized to delete this thread",
			});
		}

		await prisma.thread.delete({ where: { id: threadId } });

		return NextResponse.json({
			success: true,
			message: "Thread Deleted Successfully",
		});
	} catch (error: any) {
		console.log(error.message);
		return NextResponse.json({
			success: false,
			message: error.message,
		});
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
