import { userAuth } from "@/lib/auth";
import { createMessage, getConversationUser } from "@/lib/controllers/messageController";
import { handleApiError } from "@/lib/errors/errorResponse";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, context: { params: Promise<{ receiverId: string }> }) {
    try {
        const { receiverId } = await context.params;
        const { content } = await req.json();

        const user = await userAuth();

        const response = await createMessage(user.id, receiverId, content);

        return NextResponse.json({ message: "Message sent successfully", ...response }, { status: 200 });
    } catch (error) {
        return handleApiError(error)
    }
}

export async function GET(_req:NextRequest, context: { params: Promise<{ receiverId: string }> }) {
    try {
        const { receiverId } = await context.params;

        await userAuth();

        const receiver = await getConversationUser(receiverId);

        return NextResponse.json({ message: "Messages fetched successfully", receiver }, { status: 200 });
    } catch (error) {
        return handleApiError(error)
    }
}