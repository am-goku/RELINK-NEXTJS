import { ICommentDocument, IReplyDocument } from "@/models/Comment";
import { IUserDocument } from "@/models/User";
import { Types } from "mongoose";

type PopulatedUser = Pick<IUserDocument, "_id" | "name" | "username" | "image">;

type PopulatedComment = Omit<ICommentDocument, "user"> & {
    author: PopulatedUser;
};

type PopulatedReply = Omit<IReplyDocument, "author"> & {
    author: PopulatedUser;
};

export type SanitizedComment = {
    _id: string;
    content: string;
    post: string;
    author: {
        _id: string;
        name?: string;
        username: string;
        image?: string;
    };
    replies: {content: string, author: Types.ObjectId}[];
    created_at?: Date;
    updated_at?: Date;
}

export type SanitizedReply = {
    [x: string]: Date | undefined;
    _id: string;
    content: string;
    author: {
        _id: string;
        name?: string;
        username: string;
        image?: string;
    };
    created_at?: Date;
    updated_at?: Date;
}

export function sanitizeComment(comment: PopulatedComment): SanitizedComment {
    return {
        _id: comment._id.toString(),
        content: comment.content,
        post: comment.post.toString(),
        author: {
            _id: comment.author._id.toString(),
            name: comment.author.name,
            username: comment.author.username,
            image: comment.author.image,
        },
        replies: comment.replies || [],
        created_at: comment.created_at,
        updated_at: comment.updated_at,
    };
}

export function sanitizeReply(replies: PopulatedReply[]): SanitizedReply[] {
    
    const sanitized = replies.map((reply) => {
        return {
            _id: reply._id.toString(),
            content: reply.content,
            author: {
                _id: reply.author._id.toString(),
                name: reply.author.name,
                username: reply.author.username,
                image: reply.author.image,
            },
            created_at: reply.created_at,
            updated_at: reply.updated_at,
        }
    })
    
    return sanitized
}