import { AuthOptions } from "next-auth";
import credentialsProvider from "./credentialsProvider";
import { callbacks } from "./callbacks";

export const authOptions: AuthOptions = {
    providers: [credentialsProvider],

    pages: {
        signIn: "/auth/login",
    },

    session: {
        strategy: "jwt",
    },

    jwt: {
        secret: process.env.JWT_SECRET,
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },

    callbacks,

    secret: process.env.NEXTAUTH_SECRET,
};