import { userAuth } from "@/lib/auth";
import { getConversations } from "@/lib/controllers/messageController";
import { handleApiError } from "@/lib/errors/errorResponse";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const user = await userAuth();
        const id = user.id;

        const chatData = await getConversations(id);

        return NextResponse.json(
            {
                message: "Conversations fetched successfully",
                conversations: chatData
            },
            { status: 200 }
        );
    } catch (error) {
        return handleApiError(error);
    }
}