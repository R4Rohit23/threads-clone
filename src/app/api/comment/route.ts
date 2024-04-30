import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismaClient";
import { SENDER_SELECT } from "../config";
import { verifyToken } from "@/validation/verifyToken";
import { User } from "@prisma/client";

const updateType = ["commentLike", "parentComment", "subComment"];

// Get comment by id
export async function GET(req: NextRequest) {
	try {
		const { searchParams } = req.nextUrl;

		const id = searchParams.get("id");

		if (!id) {
			return NextResponse.json({
				success: false,
				message: "Please provide comment id",
			});
		}

		const comment = await prisma.comment.findFirst({
			where: {
				id: id,
			},
			include: {
				sender: SENDER_SELECT,
				subComments: {
					include: {
						sender: SENDER_SELECT,
					},
				},
			},
		});

		if (!comment) {
			return NextResponse.json({
				success: false,
				message: "Comment not found",
			});
		}

		return NextResponse.json({
			success: true,
			data: comment,
		});
	} catch (error: any) {
		console.log(error);
		return NextResponse.json({ success: false, error: error.message });
	}
}

// Create a new Parent Comment or Sub Comment
export async function POST(req: NextRequest) {
	try {
		const { type, threadId, text, parentId } = await req.json();
		const user = await verifyToken(req);

		if (!type || !threadId) {
			return NextResponse.json({
				success: false,
				message: "Please Provide Type and Thread ID",
			});
		}

		if (!text) {
			return NextResponse.json({
				success: false,
				message: "Please Provide Text of comment",
			});
		}

		// Check if threads exist or not
		const isThreadExist = await prisma.thread.findFirst({
			where: { id: threadId },
		});

		if (!isThreadExist) {
			return NextResponse.json({
				success: false,
				message: "Thread Not Found",
			});
		}

		switch (type) {
			case "parentComment":
				return handleParentComment(user, threadId, text);
			case "subComment":
				return handleSubComment(user, threadId, text, parentId);
			default:
				return NextResponse.json({
					success: false,
					message: `Invalid type provided. Please provide type from ${updateType
						.toString()
						.split(",")
						.join(" ")}`,
				});
		}
	} catch (error: any) {
		console.log(error);
		return NextResponse.json({ success: false, message: error.message });
	}
}

export async function PUT(req: NextRequest) {
	try {
		const { commentId } = await req.json();
		const user = await verifyToken(req);

		return handleCommentLike(user, commentId);
	} catch (error: any) {
		console.error(error);
		return NextResponse.json({ success: false, message: error.message });
	}
}

const handleSubComment = async (
	user: User,
	threadId: string,
	text: string,
	parentId: string
) => {
	// Parent comment id needed for subComments
	if (!parentId) {
		return NextResponse.json({
			success: false,
			message: "Please Provide Parent Comment Id",
		});
	}

	// Create the new subComment
	const newSubComment = await prisma.comment.create({
		data: {
			text,
			sender: { connect: { id: user.id } },
			parentComment: { connect: { id: parentId } },
			thread: { connect: { id: threadId } },
		},
	});

	// Update the totalComments field of the parentComment
	const updatedParentComment = await prisma.comment.update({
		where: { id: parentId },
		data: {
			totalComments: { increment: 1 },
		},
		include: {
			subComments: true,
		},
	});

	// Update the parent thread
	const updateThread = await prisma.thread.update({
		where: { id: threadId },
		data: {
			totalComments: {
				increment: 1,
			},
		},
	});

	return NextResponse.json({
		success: true,
		message: "Comment added successfully",
		newSubComment: newSubComment,
		updatedParentComment: updatedParentComment,
		updatedThread: updateThread,
	});
};

const handleParentComment = async (
	user: User,
	threadId: string,
	text: string
) => {
	const comment = await prisma.comment.create({
		data: {
			senderId: user.id,
			text,
			threadId,
			parentCommentId: null,
		},
	});

	const updateThread = await prisma.thread.update({
		where: { id: threadId },
		data: {
			totalComments: {
				increment: 1,
			},
			comments: {
				connect: { id: comment.id },
			},
		},
	});

	return NextResponse.json({
		success: true,
		message: "Comment added successfully",
		comment: comment,
		thread: updateThread,
	});
};

const handleCommentLike = async (user: User, commentId: string) => {
	try {
		if (!commentId) {
			return NextResponse.json({
				success: false,
				message: "Please Provide Comment Id",
			});
		}

		const comment = await prisma.comment.findFirst({
			where: {
				id: commentId,
			},
		});

		if (!comment) {
			return NextResponse.json({
				success: false,
				message: "Comment not found",
			});
		}

		const isAlreadyLiked = comment.likedBy.includes(user.id);

		if (isAlreadyLiked) {
			return NextResponse.json({
				success: false,
				message: "You have already liked this comment",
			});
		} else {
			const liked = await prisma.comment.update({
				where: { id: commentId },
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
				message: "Comment liked successfully",
				data: liked,
			});
		}
	} catch (error: any) {
		console.log(error);
		return NextResponse.json({ success: false, message: error.message });
	}
};
