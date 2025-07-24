import mongoose, { Schema, Types } from "mongoose";

export interface IComment {
    _id: Types.ObjectId;
    post: Types.ObjectId;
    user: Types.ObjectId;
    text: string;
    created_at?: Date;
}

export type ICommentDocument = IComment & Document;

const CommentSchema = new Schema<ICommentDocument>(
    {
        post: {
            type: Schema.Types.ObjectId,
            required: true
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        text: {
            type: String,
            required: true
        },
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