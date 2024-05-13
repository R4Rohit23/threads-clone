import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismaClient";
import { SENDER_SELECT } from "../../config";

export async function GET(
	req: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		const id = params.id;

		if (!id) {
			return NextResponse.json({
				success: false,
				message: "Please provide thread id",
			});
		}

		const thread = await prisma.thread.findFirst({
			where: {
				id: id,
			},
			include: {
				author: SENDER_SELECT,
				comments: {
					where: {
						parentCommentId: null,
					},
					select: {
						id: true,
						text: true,
						sender: SENDER_SELECT,
						totalLikes: true,
						totalComments: true,
						parentCommentId: true,
						createdAt: true,
						likedBy: true,
					},
				},
			},
		});

		if (!thread) {
			return NextResponse.json({
				success: false,
				message: "Thread not found",
			});
		}

		return NextResponse.json({
			success: true,
			data: thread,
		});
	} catch (error: any) {
		console.log(error);
		return NextResponse.json({ success: false, error: error.message });
	}
}
