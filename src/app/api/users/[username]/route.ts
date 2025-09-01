import { userAuth } from "@/lib/auth";
import { getUserByUsername } from "@/lib/controllers/userController";
import { handleApiError } from "@/lib/errors/errorResponse";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_req: NextRequest, context: { params: Promise<{ username: string }> }) {
    try {
        const { username } = await context.params;

        const currUser = await userAuth();

        const user = await getUserByUsername(username);

        let isOwner: boolean = false;

        if (currUser.id === user._id.toString()) {
            isOwner = true;
        }

        return NextResponse.json({ message: 'User fetch successfull', user, isOwner })

    } catch (error) {
        return handleApiError(error)
    }
}