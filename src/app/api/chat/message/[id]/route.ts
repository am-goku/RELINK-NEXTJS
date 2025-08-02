import { userAuth } from "@/lib/auth";
import { deleteMessage } from "@/lib/controllers/messageController";
import { handleApiError } from "@/lib/errors/errorResponse";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params;

        const user = await userAuth();

        const deletedMessage = await deleteMessage(user.id, id);

        return NextResponse.json({ message: "Message deleted successfully", deletedMessage }, { status: 200 });
    } catch (error) {
        return handleApiError(error)
    }
}