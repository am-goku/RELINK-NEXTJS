import { NextResponse } from "next/server";
import { userAuth } from "@/lib/auth";
import { markConversationRead } from "@/lib/controllers/message";

export async function PATCH(_req: Request, context: { params: Promise<{ conversationId: string }> }) {
    const { conversationId } = await context.params;
    const user = await userAuth();
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const updated = await markConversationRead(conversationId, user.id);

    return NextResponse.json({ success: true, updated });
}