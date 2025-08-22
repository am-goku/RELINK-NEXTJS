import { getConnections } from "@/lib/controllers/userConnectionController";
import { BadRequestError } from "@/lib/errors/ApiErrors";
import { handleApiError } from "@/lib/errors/errorResponse";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, context: { params: Promise<{ id: string, type: string }> }) {
    try {
        const { id, type } = await context.params;

        if (type !== 'followers' && type !== 'following') throw new BadRequestError('Invalid type, must be followers or following');

        const users = await getConnections(id, type);

        return NextResponse.json({users});

    } catch (error) {
        return handleApiError(error);
    }
}