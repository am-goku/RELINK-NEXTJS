import { userAuth } from "@/lib/auth";
import { followUser } from "@/lib/controllers/userConnectionController";
import { handleApiError } from "@/lib/errors/errorResponse";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req:NextRequest, context: { params: Promise<{ id: string }> } ) {
    try {
        const { id } = await context.params;

        const user = await userAuth();

        const res = await followUser(user.id, id);

        return NextResponse.json(res);

    } catch (error) {
        return handleApiError(error);
    }
}