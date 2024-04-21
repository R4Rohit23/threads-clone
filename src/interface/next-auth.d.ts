import "next-auth"
import { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface User {
        profileImage?: string
        username?: string;
    }

    interface Session {
        user: {
            profileImage?: string;
            accessToken?: string;
            username?: string;
        } & DefaultSession['user']
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        profileImage?: string;
        accessToken?: string;
        username?: string;
    }
}