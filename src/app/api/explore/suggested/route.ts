import { userAuth } from "@/lib/auth";
import { getSuggesions } from "@/lib/controllers/postController";
import { handleApiError } from "@/lib/errors/errorResponse";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await userAuth();

        const suggesions = await getSuggesions();

        return NextResponse.json({ message: "Suggesions fetched successfully", suggesions }, { status: 200 });

    } catch (error) {
        return handleApiError(error);
    }
}