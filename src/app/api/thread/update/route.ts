import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismaClient"
import { verifyToken } from "@/validation/verifyToken";

export async function PUT(req: NextRequest) {
    try {
        const user = await verifyToken(req);
        
        const formData = await req.formData();
        const threadId = formData.get("threadId")?.toString();
        const title = formData.get("title")?.toString();
        const thumbnailsFromFormData = formData.getAll("thumbnails");
        const thumbnails = thumbnailsFromFormData.map((value) => value.toString());
        
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

		const isMine = thread.authorId === user.id;

		if (!isMine) {
			return NextResponse.json({
				success: false,
				message: "You are not authorized to update this thread",
			});
		}

		const updatedThread = await prisma.thread.update({
			where: {
				id: threadId,
			},
			data: {
				title,
                thumbnails
			},
		});

		return NextResponse.json({
			success: true,
			message: "Thread updated successfully",
			updatedThread,
		});
	} catch (error: any) {
		console.log(error);
		return NextResponse.json({ success: false, message: error.message });
	}
}