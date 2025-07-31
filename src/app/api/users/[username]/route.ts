import { userAuth } from "@/lib/auth";
import { getUserByUsername } from "@/lib/controllers/userController";
import { handleApiError } from "@/lib/errors/errorResponse";
import { NextResponse } from "next/server";

export async function GET(req: NextResponse, { params }: { params: { username: string } }) {
    try {
        const { username } = params;

        await userAuth();

        const user = await getUserByUsername(username);

        return NextResponse.json({ message: 'User fetch successfull', user })

    } catch (error) {
        return handleApiError(error)
    }
}