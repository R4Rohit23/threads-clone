"use server";

import prisma from "@/lib/prismaClient";
import { SENDER_SELECT } from "../../config";
import { GetServerSideProps } from "next";

export const GET: GetServerSideProps = async ({ params }) => {
	try {
		const { id } = params || {};

		if (!id) {
			return {
				notFound: true,
			};
		}

		const thread = await prisma.thread.findFirst({
			where: {
				id: id as string,
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
			return {
				notFound: true,
			};
		}

		return {
			props: {
				thread,
			},
		};
	} catch (error: any) {
		console.log(error);
		return {
			notFound: true,
		};
	}
};
