import { IHashtag } from "@/models/Hashtag";

export type SanitizedHashtag = {
    _id: string;
    tag: string;
    postsCount: number;
    lastUsed: Date;
    posts: string[];
    postCount: number;
    created_at: Date;
    updated_at: Date;
}

export function sanitizeHashtag(hashtag: IHashtag): SanitizedHashtag {
    return {
        _id: hashtag?._id.toString(),
        tag: hashtag.tag,
        postsCount: hashtag.postsCount,
        lastUsed: hashtag.lastUsed,
        posts: hashtag.posts.map(post => post.toString()),
        postCount: hashtag.postsCount,
        created_at: hashtag.created_at,
        updated_at: hashtag.updated_at
    };
}