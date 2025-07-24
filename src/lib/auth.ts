import CredentialsProvider from "next-auth/providers/credentials";
import { AuthOptions, getServerSession } from "next-auth";
import { connectDB } from "./mongoose";
import { compare } from "bcryptjs";
import User, { IUser } from "@/models/User";
import { ForbiddenError, UnauthorizedError } from "./errors/ApiErrors";

export const authOptions: AuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                await connectDB();

                const user: IUser | null = await User.findOne({ email: credentials?.email });

                if (!user) throw new Error("No user found");

                const isPasswordCorrect = await compare(credentials!.password, user.password);

                if (!isPasswordCorrect) throw new Error("Incorrect password");

                if (user.blocked) throw new Error("User is blocked");

                if (user.deleted) throw new Error("User account deleted");

                // Return only essential info for token
                return {
                    id: user._id.toString(),
                    email: user.email,
                    username: user.username,
                    role: user.role, // IMPORTANT for role-based auth!
                };
            },
        }),
    ],

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

    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.email = user.email;
                token.username = user.username;
                token.role = user.role; // add role to JWT token payload
            }
            return token;
        },

        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.email = token.email as string;
                session.user.username = token.username as string;
                session.user.role = token.role as 'user' | 'admin' | 'super-admin'; // pass role to session
            }
            return session;
        },
    },

    secret: process.env.NEXTAUTH_SECRET,
};


type Role = 'user' | 'admin' | 'super-admin';

const ROLE_HIERARCHY: Record<Role, number> = {
  user: 1,
  admin: 2,
  'super-admin': 3,
};

export async function userAuth(
  requiredRole: Role = 'user'
) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    throw new UnauthorizedError('You must be signed in to access this resource.');
  }

  const userRole = session.user.role as Role;

  if (ROLE_HIERARCHY[userRole] < ROLE_HIERARCHY[requiredRole]) {
    throw new ForbiddenError('You do not have sufficient permissions.');
  }

  return session.user;
}