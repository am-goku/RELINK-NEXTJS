import { userAuth } from "@/lib/auth";
import { createMessage, getMessages } from "@/lib/controllers/messageController";
import { handleApiError } from "@/lib/errors/errorResponse";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, { params }: { params: { receiverId: string } }) {
    try {
        const { receiverId } = params;
        const { message } = await req.json();

        const user = await userAuth();

        const chat = await createMessage(user.id, receiverId, message);

        return NextResponse.json({ message: "Message sent successfully", chat }, { status: 200 });
    } catch (error) {
        return handleApiError(error)
    }
}

export async function GET(req: NextRequest, { params }: { params: { receiverId: string } }) {
    try {
        const { receiverId } = params;
        const { searchParams } = new URL(req.url);

        const page = searchParams.get("page");

        const user = await userAuth();

        const messages = await getMessages(user.id, receiverId, Number(page) || 0);

        return NextResponse.json({ message: "Messages fetched successfully", messages }, { status: 200 });
    } catch (error) {
        handleApiError(error);
    }
}