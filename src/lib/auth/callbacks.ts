import { Session } from "next-auth";
import { JWT } from "next-auth/jwt";

export const callbacks = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async jwt({ token, user }: { token: JWT; user?: any }) {
        if (user) {
            token.id = user.id;
            token.email = user.email;
            token.username = user.username;
            token.role = user.role;
        }
        return token;
    },

    async session({ session, token }: { session: Session, token: JWT }) {
        if (session.user) {
            session.user.id = token.id as string;
            session.user.email = token.email as string;
            session.user.username = token.username as string;
            session.user.role = token.role as 'user' | 'admin' | 'super-admin';
        }
        return session;
    },
};