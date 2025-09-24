import { findAHashtag } from "@/lib/controllers/hashtagController";
import { handleApiError } from "@/lib/errors/errorResponse";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const tag = searchParams.get('tag');

        if (!tag) {
            return NextResponse.json({ error: 'tag is required' }, { status: 400 });
        }

        const hashtags = await findAHashtag(tag);

        return NextResponse.json(hashtags, { status: 200 });

    } catch (error) {
        return handleApiError(error)
    }
}