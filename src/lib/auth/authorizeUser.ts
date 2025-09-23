import User, { IUser } from "@/models/User";
import { connectDB } from "../db/mongoose";
import { compare } from "bcryptjs";
import { UnverifiedUser } from "@/models/UnverifiedUsers";

export async function authorizeUser(credentials: Record<"email" | "password", string> | undefined) {
    if (!credentials) throw new Error("Missing credentials");

    await connectDB();

    const user: IUser | null = await User.findOne({ email: credentials.email });

    if (!user) {

        const unverifiedUser = await UnverifiedUser.findOne({ email: credentials.email });

        if (!unverifiedUser) throw new Error("No user found")

        throw new Error(
            JSON.stringify({
                message: "User not verified",
                cause: { verified: false, email: unverifiedUser.email, username: unverifiedUser.username }
            })
        );
    };


    if (user.deleted) throw new Error("User account deleted");
    if (user.blocked) throw new Error("User is blocked");

    const isPasswordCorrect = await compare(credentials.password, user.password);
    if (!isPasswordCorrect) throw new Error("Incorrect password");

    return {
        id: user._id.toString(),
        email: user.email,
        username: user.username,
        role: user.role
    };
}