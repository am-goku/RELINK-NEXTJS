import { IPostDocument } from "@/models/Post";
import { IUserDocument } from "@/models/User";

// Public view (sanitized version)
export interface IPublicPost {
    _id: string;
    content?: string;
    image?: string;
    imageRatio?: "landscape" | "portrait" | "square";
    hashtags: string;
    
    // Interactions
    likes: string[];
    saves: string[];
    views: string[];
    comments_count: number;
    likes_count: number;
    share_count: number;

    author: {
        _id: string;
        name: string;
        username: string;
        image: string;
    };
    created_at: Date;
}

type PopulatedUser = Pick<IUserDocument, "_id" | "name" | "username" | "image">;

export type PopulatedPost = Omit<IPostDocument, "author"> & {
    author: PopulatedUser;
};

export function sanitizePost(post: PopulatedPost): IPublicPost {
    return {
        _id: post._id.toString(),
        content: post.content,
        image: post.image,
        imageRatio: post.imageRatio,
        hashtags: Array.isArray(post.hashtags) ? post.hashtags.join(", ") : "",
        
        // Interactions
        views: Array.isArray(post.views) ? post.views.map(v => v.toString()) : [],
        likes: Array.isArray(post.likes) ? post.likes.map(v => v.toString()) : [],
        saves: Array.isArray(post.saves) ? post.saves.map(v => v.toString()) : [],
        
        // count
        comments_count: post.comments?.length || 0,
        likes_count: post.likes?.length || 0,
        share_count: post.share_count ?? 0,


        created_at: post.created_at ?? new Date(),
        author: {
            _id: post.author._id.toString(),
            name: post.author.name ?? "",
            username: post.author.username,
            image: post.author.image ?? "",
        },
    };
}
