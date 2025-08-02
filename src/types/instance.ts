export type SessionUser = {
    id: string;
    email: string;
    username: string;
    role: "user" | "admin" | "super-admin";
}