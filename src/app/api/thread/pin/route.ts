import { verifyToken } from "@/validation/verifyToken";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismaClient";

export async function PUT(req: NextRequest) {
	try {
		const user = await verifyToken(req);
		const { threadId } = await req.json();
		if (!threadId) {
			return NextResponse.json({
				success: false,
				message: "threadId is required",
			});
		}

		const thread = await prisma.thread.findFirst({
			where: { id: threadId },
		});

		if (thread?.authorId !== user.id) {
			return NextResponse.json({
				success: false,
				message: "You are not the authorize to update this thread",
			});
		}

		if (thread?.isPinned) {
			const updatedThread = await prisma.thread.update({
				where: { id: threadId },
				data: {
					isPinned: false,
				},
				select: { title: true },
			});
			return NextResponse.json({
				success: true,
				message: "Thread unpinned",
				updatedThread,
			});
		} else {
			const updatedThread = await prisma.thread.update({
				where: { id: threadId },
				data: {
					isPinned: true,
				},
				select: { title: true },
			});
			return NextResponse.json({
				success: true,
				message: "Thread pinned",
				updatedThread,
			});
		}
	} catch (error: any) {
		console.error(error.message);
		return NextResponse.json({
			success: false,
			message: error.message,
		});
	}
}
