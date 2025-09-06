import { validateUsername } from "@/lib/controllers/userController";
import { handleApiError } from "@/lib/errors/errorResponse";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const username = searchParams.get("username");

        if (!username) {
            return NextResponse.json(
                { available: false, message: "Username is required" },
                { status: 400 }
            );
        }

        const available = await validateUsername(username);

        return NextResponse.json({ available })

    } catch (error) {
        return handleApiError(error)
    }
}