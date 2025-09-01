import { userAuth } from "@/lib/auth";
import { createMessage } from "@/lib/controllers/messageController";
import { handleApiError } from "@/lib/errors/errorResponse";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, context: { params: Promise<{ receiverId: string }> }) {
    try {
        const { receiverId } = await context.params;
        const { message } = await req.json();

        const user = await userAuth();

        const response = await createMessage(user.id, receiverId, message);

        return NextResponse.json({ message: "Message sent successfully", ...response }, { status: 200 });
    } catch (error) {
        return handleApiError(error)
    }
}