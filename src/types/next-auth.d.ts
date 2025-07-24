// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NextAuth, { DefaultSession, User as NextAuthUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      username: string;
      role: "user" | "admin" | "super-admin";
    } & DefaultSession["user"];
  }

  interface JWT {
    id: string;
    email: string;
    username: string;
    role: "user" | "admin" | "super-admin";
  }

  interface User extends NextAuthUser {
    username: string;
    role: "user" | "admin" | "super-admin";
  }
}