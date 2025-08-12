import { userAuth } from "@/lib/auth";
import { getUserByUsername } from "@/lib/controllers/userController";
import { handleApiError } from "@/lib/errors/errorResponse";
import { NextResponse } from "next/server";

export async function GET(req: NextResponse, context: { params: Promise<{ username: string }> }) {
    try {
        const { username } = await context.params;

        const currUser = await userAuth();

        const user = await getUserByUsername(username);

        let isOwner = false;

        if (currUser.id === user._id.toString()) {
            isOwner = true;
        }

        return NextResponse.json({ message: 'User fetch successfull', user, isOwner })

    } catch (error) {
        return handleApiError(error)
    }
}