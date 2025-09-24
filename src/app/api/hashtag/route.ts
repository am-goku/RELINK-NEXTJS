import { getTrendingHashtags, searchHashtags } from "@/lib/controllers/hashtagController";
import { handleApiError } from "@/lib/errors/errorResponse";
import { IHashtag } from "@/models/Hashtag";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url)
        const key = searchParams.get('key');
        const limit = searchParams.get('limit') || 10;

        const trending = searchParams.get('trending') === 'true';

        let hashtags: IHashtag[] = [];

        if (!key && !trending) {
            return NextResponse.json({ error: 'key or trending is required' }, { status: 400 });
        }

        if (trending) {
            hashtags = await getTrendingHashtags(Number(limit));
        }

        if (key) {
            hashtags = await searchHashtags(key, Number(limit));
        }

        return NextResponse.json(hashtags, { status: 200 });
    } catch (error) {
        return handleApiError(error)
    }
}