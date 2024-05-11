import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prismaClient";
import toast from "react-hot-toast";

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
		async signIn({ account, profile }) {
			if (account?.provider === "google") {
				try {
					const user = await prisma.user.findFirst({
						where: { email: profile?.email },
					});

					if (!user) {
						const randomPassword = crypto.randomUUID();

						const hashedPassword = await bcrypt.hash(randomPassword, 10);

						const newUser = await prisma.user.create({
							data: {
								email: profile?.email as string,
								username: profile?.name as string,
								name: profile?.name as string,
								password: hashedPassword,
								profileImage: profile?.picture,
							},
						});

						toast.success("User registered successfully");
						console.log(newUser);
						return true;
					}

					return true;
				} catch (error) {
					console.error(error);
					return true;
				}
			} else {
				return true;
			}
		},
		async session({ session, token }) {
			if (token) {
				session.user.profileImage = token.profileImage;
				session.user.accessToken = token.accessToken;
				session.user.username = token.username;
				session.user.id = token.id;
			}
			return session;
		},
		async jwt({ token, user, account, profile }) {
			if (user) {
				token.profileImage = user.profileImage;
				token.username = user.username;
				token.id = user.id;
			}

			if (account && profile) {
				token.accessToken = account.access_token;
				token.username = profile.name;
				const dbUser = await prisma.user.findUnique({
					where: {
						email: profile?.email,
					},
				});

				if (dbUser) {
					token.id = dbUser.id;
				}
			}

			return token;
		},
	},
};
