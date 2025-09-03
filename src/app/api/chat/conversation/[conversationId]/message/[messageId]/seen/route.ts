import { userAuth } from "@/lib/auth";
import { markMessageAsSeen } from "@/lib/controllers/messageController";
import { handleApiError } from "@/lib/errors/errorResponse";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(_req: NextRequest, context: { params: Promise<{ conversationId: string, messageId: string }> }) {
    try {
        const { conversationId, messageId } = await context.params;

        const user = await userAuth();

        const res = await markMessageAsSeen(messageId, conversationId, user.id);

        return NextResponse.json({ message: "Message seen successfully", messageData: res }, { status: 200 });
    } catch (error) {
        return handleApiError(error)
    }
}