import Post, { IPostDocument } from "@/models/Post";
import { FilterQuery, Types } from "mongoose";
import { connectDB } from "../db/mongoose";
import { PopulatedPost, sanitizePost } from "@/utils/sanitizer/post";

export async function searchPosts(
    query: string,
    isHashtag = false,
    userId: string,
    page = 1,
    limit = 10
) {
    await connectDB();

    // normalize query (strip leading # for hashtags)
    const normalizedQuery = query.startsWith("#") ? query.slice(1) : query;

    const filter: FilterQuery<IPostDocument> = {
        image: { $exists: true, $ne: "" },
        is_blocked: { $ne: true },
        is_archived: { $ne: true },
        // 👇 exclude posts where views already contains this user
        views: { $ne: new Types.ObjectId(userId) },
    };

    if (isHashtag) {
        // exact match in hashtags array
        filter.hashtags = normalizedQuery;
    } else {
        // partial match on content or hashtags
        filter.$or = [
            { content: { $regex: normalizedQuery, $options: "i" } },
            { hashtags: { $regex: normalizedQuery, $options: "i" } },
        ];
    }

    const total = await Post.countDocuments(filter);
    if (total === 0) {
        return { results: [], total: 0, page, pages: 0 };
    }

    const posts = await Post.find(filter)
        .skip((page - 1) * limit)
        .limit(limit)
        .populate("user", "name avatar")
        .lean<PopulatedPost[]>();

    return {
        results: posts.map(sanitizePost),
        total,
        page,
        pages: Math.ceil(total / limit),
    };
}
