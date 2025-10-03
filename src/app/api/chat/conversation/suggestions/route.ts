import { userAuth } from "@/lib/auth";
import { getChatSuggestions } from "@/lib/controllers/conversation";
import { handleApiError } from "@/lib/errors/errorResponse";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const user = await userAuth();

        const result = await getChatSuggestions(user.id);

        return NextResponse.json(result, { status: 200 });

    } catch (error) {
        return handleApiError(error);
    }
} // Handler to fetch chat conversation suggestions API: [GET /api/chat/conversation/suggestions]