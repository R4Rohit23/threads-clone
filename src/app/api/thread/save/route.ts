import { verifyToken } from "@/validation/verifyToken";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismaClient";
import { SENDER_SELECT } from "../../config";

export const POST = async (req: NextRequest) => {
	try {
		const user = await verifyToken(req);
		const { threadId } = await req.json();

		if (!threadId) {
			return NextResponse.json({
				success: false,
				message: "threadId is required",
			});
		}

		// check if thread is present or not
		const thread = await prisma.thread.findFirst({
			where: { id: threadId },
		});

		if (!thread) {
			return NextResponse.json({
				success: false,
				message: "Thread Not Found",
			});
		}

		// check if user has already saved the thread
		const isAlreadySaved = thread.savedBy.includes(user.id);

		// if already saved then un-save the thread
		if (isAlreadySaved) {
			const updatedThread = await prisma.thread.update({
				where: { id: thread.id },
				data: {
					savedBy: {
						set: thread.savedBy.filter((userId) => userId !== user.id),
					},
				},
				select: {
					title: true,
					savedBy: true,
				},
			});
			return NextResponse.json({
				success: true,
				message: "Thread Unsaved Successfully",
				updatedThread,
			});
		} else {
			const updatedThread = await prisma.thread.update({
				where: { id: thread.id },
				data: {
					savedBy: {
						push: user.id,
					},
				},
				select: {
					title: true,
					savedBy: true,
				},
			});

			return NextResponse.json({
				success: true,
				message: "Thread Saved Successfully",
				updatedThread,
			});
		}
	} catch (error: any) {
		console.log(error);
		return NextResponse.json({
			success: false,
			message: "Error While Saving Thread",
			error: error.message,
		});
	}
};

export const GET = async (req: NextRequest) => {
	try {
		const user = await verifyToken(req);

		const threads = await prisma.thread.findMany({
			where: {
				savedBy: {
					has: user.id, // filter the thread on the basis of savedBy array which includes my userId
				},
			},
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

        return NextResponse.json({
            success: true,
            message: "Threads Fetched Successfully",
            data: threads,
        });

	} catch (error: any) {
		console.log(error);
		return NextResponse.json({
			success: false,
			message: "Error While Fetching Threads",
			error: error.message,
		});
	}
};
