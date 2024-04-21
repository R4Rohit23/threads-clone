import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prismaClient";

export const authOptions: NextAuthOptions = {
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID as string,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
		}),
		CredentialsProvider({
			name: "Credentials",
			id: "credentials",
			credentials: {
				email: {
					label: "Email",
					type: "email",
					placeholder: "Email",
				},
				password: {
					label: "Password",
					type: "password",
					placeholder: "Password",
				},
			},
			async authorize(credentials: any): Promise<any> {
				const { email, password } = credentials;

				try {
					const user = await prisma.user.findFirst({ where: { email: email } });

					if (!user) {
						throw new Error("User Not Found");
					} else {
						if (await bcrypt.compare(password, user.password)) {
							return user;
						} else {
							throw new Error("Invalid Password");
						}
					}
				} catch (error: any) {
					console.error(error);
					throw new Error(error);
				}
			},
		}),
	],
	debug: true,
	secret: process.env.NEXTAUTH_SECRET,
	session: {
		strategy: "jwt",
		maxAge: 1 * 24 * 60 * 60,
	},
	callbacks: {
		async session({ session, token }) {
			if (token) {
				session.user.profileImage = token.profileImage;
				session.user.accessToken = token.accessToken;
				session.user.username = token.username;
			}
			return session;
		},
		async jwt({ token, user, account }) {
			if (user) {
				token.profileImage = user.profileImage;
				token.username = user.username;
			}

			if (account) {
				token.accessToken = account.access_token;
			}

			return token;
		},
	},
};
