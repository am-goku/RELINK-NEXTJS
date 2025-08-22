import { userAuth } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { handleApiError } from "@/lib/errors/errorResponse";
import { getAuthenticatedUserById, updateUserProfile } from "@/lib/controllers/userController";
import { UnauthorizedError } from "@/lib/errors/ApiErrors";
import { authOptions } from "@/lib/auth/authOptions";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            throw new UnauthorizedError('Unauthorized');
        }

        const user = await getAuthenticatedUserById(session.user.id);

        return NextResponse.json({ user });
    } catch (error) {
        return handleApiError(error);
    }
}

export async function PUT(req: Request) {
    try {
        const user = await userAuth();

        const body = await req.json();

        const updatedUser = await updateUserProfile({
            email: user.email,
            data: body,
        });

        return NextResponse.json({ message: 'User update successful', user: updatedUser });
    } catch (error) {
        return handleApiError(error);
    }
}
