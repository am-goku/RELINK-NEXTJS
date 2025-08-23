import { userAuth } from "@/lib/auth";
import { updateLinksById } from "@/lib/controllers/userController";
import { BadRequestError } from "@/lib/errors/ApiErrors";
import { handleApiError } from "@/lib/errors/errorResponse";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
    try {
        const session = await userAuth();

        const body = await req.json();
        const { links }: { links: string[] } = body;

        if (!Array.isArray(links)) {
            throw new BadRequestError("Links must be an array");
        }

        const user = await updateLinksById(session?.id, links);

        return NextResponse.json({ user });

    } catch (error) {
        return handleApiError(error);
    }
}