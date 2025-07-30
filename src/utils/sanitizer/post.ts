import { IPostDocument } from "@/models/Post";
import { IUserDocument } from "@/models/User";

type PopulatedUser = Pick<IUserDocument, "_id" | "name" | "username" | "image">;

type PopulatedPost = Omit<IPostDocument, "user"> & {
    user: PopulatedUser;
};

export function sanitizePost(post: PopulatedPost) {
    return {
        _id: post._id.toString(),
        content: post.content,
        image: post.image,
        hashtags: Array.isArray(post.hashtags) ? post.hashtags.join(", ") : "",
        likes_count: post.likes?.length || 0,
        comments_count: post.comments?.length || 0,
        share_count: post.share_count ?? 0,
        views: post.views ?? 0,
        created_at: post.created_at,
        updated_at: post.updated_at,
        user: {
            _id: post.user._id.toString(),
            name: post.user.name,
            username: post.user.username,
            image: post.user.image,
        },
    };
}
