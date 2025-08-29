import { connectDB } from "@/lib/db/mongoose";
import Comment from "@/models/Comment";
import { BadRequestError } from "../errors/ApiErrors";
import { sanitizeComment } from "@/utils/sanitizer/comment";

const PAGE_SIZE = 20;

export async function createComment(postId: string, text: string, userId: string) {
    await connectDB();

    const newComment = new Comment({
        post: postId,
        content: text,
        author: userId
    });

    const comment = await newComment.save();
    await comment.populate('author', 'username image');

    return sanitizeComment(comment);
}

export async function getComments(postId: string, page: number = 1) {
    await connectDB();

    const comments = await Comment.find({ post: postId })
        .populate("author", "username image")
        .sort({ created_at: -1 })
        .skip((page - 1) * PAGE_SIZE)
        .limit(PAGE_SIZE);

    return comments.map(sanitizeComment);
}

export async function getCommentById(commentId: string) {
    await connectDB();

    const comment = await Comment.findById(commentId)
        .populate("author", "username image")
        .populate("replies.author", "username image");

    return comment ? sanitizeComment(comment) : null;
}

export async function deleteComment(commentId: string, postId: string, userId: string): Promise<void> {
    await connectDB();

    const result = await Comment.deleteOne({
        _id: commentId,
        post: postId,
        author: userId
    });

    if (!result.acknowledged || result.deletedCount === 0) {
        throw new BadRequestError("Comment not found.");
    }
}