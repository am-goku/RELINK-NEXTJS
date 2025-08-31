import { userAuth } from "@/lib/auth";
import { getAConversation } from "@/lib/controllers/messageController";
import { handleApiError } from "@/lib/errors/errorResponse";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_req: NextRequest, context: { params: Promise<{ conversationId: string }> }) {
    try {
        const user = await userAuth();

        const { conversationId } = await context.params;

        const chatData = await getAConversation(conversationId, user.id);

        return NextResponse.json(
            {
                message: "Conversation fetched successfully",
                conversation: chatData
            },
            { status: 200 }
        );

    } catch (error) {
        return handleApiError(error);
    }
}