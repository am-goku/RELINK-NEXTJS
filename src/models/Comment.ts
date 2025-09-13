import mongoose, { Schema, Types } from "mongoose";

export interface IComment {
    _id: Types.ObjectId;
    post: Types.ObjectId;
    author: Types.ObjectId;
    content: string;
    replies?: { content: string, author: Types.ObjectId, created_at: Date }[];
    created_at?: Date;
    updated_at?: Date;
}

export type ICommentDocument = IComment & Document;

export type IReplyDocument = {
    _id: Types.ObjectId;
    content: string;
    author: Types.ObjectId;
    created_at?: Date;
    updated_at?: Date;
} & Document;

const ReplySchema = new mongoose.Schema<IReplyDocument>(
    {
        content: { type: String, required: true },
        author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    },
    {
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at"
        },
    }
);

const CommentSchema = new Schema<ICommentDocument>(
    {
        post: {
            type: Schema.Types.ObjectId,
            required: true
        },
        author: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        content: {
            type: String,
            required: true
        },
        replies: [ReplySchema]
    },
    {
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at"
        },
    }
);

const Comment = mongoose.models.Comment || mongoose.model<ICommentDocument>('Comment', CommentSchema);

export default Comment;