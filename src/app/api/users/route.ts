import { userAuth } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { handleApiError } from "@/lib/errors/errorResponse";
import { getAuthenticatedUserById, updateUserProfile } from "@/lib/controllers/userController";
import { UnauthorizedError } from "@/lib/errors/ApiErrors";
import { authOptions } from "@/lib/auth/authOptions";
import { AppError } from "@/lib/errors/error.types";
import { createUser } from "@/lib/controllers/authController";

// To create a new user
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const user = await createUser({
      email: body.email,
      username: body.username,
      password: body.password,
    });

    return NextResponse.json({
      message: "User created successfully",
      user,
    });
  } catch (err) {
    const error = err as AppError;
    return NextResponse.json(
      {
        message: error.message || "Something went wrong",
        code: error.code || "UNKNOWN_ERROR",
      },
      { status: error.status || 400 }
    );
  }
}

// To get the authenticated user
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

// To update the authenticated user
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
