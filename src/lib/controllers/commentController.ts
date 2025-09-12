import { connectDB } from "@/lib/db/mongoose";
import Comment from "@/models/Comment";
import { BadRequestError, NotFoundError } from "../errors/ApiErrors";
import { sanitizeComment } from "@/utils/sanitizer/comment";
import { normalizeToObjectId } from "@/utils/types/normalize";
import { Types } from "mongoose";

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

    const comments = await Comment.find({ post: normalizeToObjectId(postId) })
        .populate("author", "username image")
        .sort({ created_at: -1 })
        .skip((page - 1) * PAGE_SIZE)
        .limit(PAGE_SIZE);

    return comments?.map(sanitizeComment) || [];
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

export async function createReply({ commentId, author, content }: {
    commentId: string;
    author: Types.ObjectId;
    content: string;
}
): Promise<void> {
    await connectDB();

    const reply = {
        content,
        author
    };

    await Comment.findByIdAndUpdate(commentId, { $push: { replies: reply } });

    // Fetch only the last reply (the one we just added)
    const updatedComment = await Comment.findById(commentId)
        .select({ replies: { $slice: -1 } }) // get only last element in array
        .populate("replies.author", "username image name");

    if (!updatedComment || updatedComment.replies.length === 0) {
        throw new Error("Reply creation failed");
    }

    return updatedComment.replies[0]; // return just the new reply

}

export async function getReplies(commentId: string) {
    await connectDB();

    const comment = await Comment.findById(commentId)
      .select("replies") // only fetch replies field
      .populate("replies.author", "username image"); // optional populate

    if (!comment) {
      throw new NotFoundError("Comment not found");
    }

    return comment.replies;
}