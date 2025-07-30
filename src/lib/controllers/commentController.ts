import { connectDB } from "@/lib/mongoose";
import Comment from "@/models/Comment";
import { BadRequestError } from "../errors/ApiErrors";
import { sanitizeComment } from "@/utils/comment";

const PAGE_SIZE = 20;

export async function createComment(postId: string, text: string, userId: string) {
    await connectDB();

    const newComment = new Comment({
        post: postId,
        comment: text,
        user: userId
    });

    const comment = await newComment.save();
    await comment.populate('user');

    return sanitizeComment(comment);
}

export async function getComments(postId: string, page: number = 1) {
    await connectDB();

    const comments = await Comment.find({ post: postId })
        .populate("user")
        .sort({ created_at: -1 })
        .skip((page - 1) * PAGE_SIZE)
        .limit(PAGE_SIZE);

    return comments.map(sanitizeComment);
}

export async function deleteComment(commentId: string, postId: string, userId: string): Promise<void> {
    await connectDB();

    const result = await Comment.deleteOne({
        _id: commentId,
        post: postId,
        user: userId
    });

    if (!result.acknowledged || result.deletedCount === 0) {
        throw new BadRequestError("Comment not found.");
    }
}