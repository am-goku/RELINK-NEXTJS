import { Hashtag } from "@/models/Hashtag";
import { Types } from "mongoose";

export async function trackPostHashtags(postId: Types.ObjectId, hashtags: string[]) {
    await Promise.all(
        hashtags.map(tag => Hashtag.incrementUsage(tag, postId))
    );
}

export async function getTrendingHashtags(size: number = 10) {
    const trending = await Hashtag.getTrending(size);
    return trending;
}

export async function findAHashtag(tag: string) {
    const hashtag = await Hashtag.findOne({ tag })
        .populate("posts", "content author image created_at")
        .exec();
    return hashtag;
}

export async function searchHashtags(query: string, limit: number = 10) {
    if (!query) return [];

    const regex = new RegExp("^" + query, "i"); // starts with query, case-insensitive

    const hashtags = await Hashtag.find({ tag: { $regex: regex } })
        .sort({ postsCount: -1 }) // most popular first
        .limit(limit)
        .select("tag postsCount lastUsed");

    return hashtags;
}