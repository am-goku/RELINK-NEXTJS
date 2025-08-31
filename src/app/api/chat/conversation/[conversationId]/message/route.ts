import { userAuth } from "@/lib/auth";
import { createMessageInConversation, getMessages } from "@/lib/controllers/messageController";
import { handleApiError } from "@/lib/errors/errorResponse";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_req: NextRequest, context: { params: Promise<{ conversationId: string }> }) {
    try {
        const { conversationId } = await context.params;

        const user = await userAuth();

        const messages = await getMessages(user.id, conversationId);

        return NextResponse.json(
            {
                message: "Messages fetched successfully",
                messages
            },
            { status: 200 }
        );

    } catch (error) {
        return handleApiError(error);
    }
}

export async function POST(req: NextRequest, context: {params: Promise<{conversationId: string}>}) {
    try {
        const { conversationId } = await context.params;

        const user = await userAuth();

        const { content } = await req.json();

        const message = await createMessageInConversation(conversationId, user.id, content);

        return NextResponse.json(
            {
                message: "Message sent successfully",
                messageData: message
            },
            { status: 200 }
        );

    } catch (error) {
        return handleApiError(error);
    }
}