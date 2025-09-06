import { AuthOptions } from "next-auth";
import credentialsProvider from "./credentialsProvider";
import { callbacks } from "./callbacks";

export const authOptions: AuthOptions = {
    providers: [credentialsProvider],

    pages: {
        signIn: "/connect",
    },

    session: {
        strategy: "jwt",
    },

    callbacks,

    secret: process.env.NEXTAUTH_SECRET,
};