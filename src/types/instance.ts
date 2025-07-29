export interface SessionUser {
    id: string;
    email: string;
    username: string;
    role: "user" | "admin" | "super-admin";
    name?: string | null;
    image?: string | null;
}