import { userAuth } from "@/lib/auth";
import { deleteMessage } from "@/lib/controllers/messageController";
import { handleApiError } from "@/lib/errors/errorResponse";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(_req: NextRequest, context: { params: Promise<{ conversationId: string, messageId: string }> }) {
    try {
        const { conversationId, messageId } = await context.params;

        const user = await userAuth();

        const deletedMessage = await deleteMessage(user.id, messageId, conversationId);

        return NextResponse.json({ message: "Message deleted successfully", deletedMessage }, { status: 200 });
    } catch (error) {
        return handleApiError(error)
    }
}