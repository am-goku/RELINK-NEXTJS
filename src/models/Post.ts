import mongoose, { Schema, Document, Types } from "mongoose";

// Base Post Interface
export interface IPostBase {
    _id: Types.ObjectId;
    content?: string;
    image?: string;
    likes: Types.ObjectId[];
    comments: Types.ObjectId[];
    share_count: number;
    views: number;
    hashtags: string[];
    user: Types.ObjectId;

    // Admin fields
    is_blocked: boolean;
    is_archived: boolean;
    is_sensitive: boolean;
    created_at?: Date;
    updated_at?: Date;
}

// For MongoDB Document
export type IPostDocument = IPostBase & Document;

// Public view (sanitized version)
export interface IPublicPost {
    _id: string;
    content?: string;
    image?: string;
    likes_count: number;
    comments_count: number;
    share_count: number;
    views: number;
    hashtags: string;
    user: {
        _id: string;
        name: string;
        username: string;
        image: string;
    };
    created_at: Date;
}


// Post Schema
const PostSchema = new Schema<IPostDocument>(
    {
        content: {
            type: String,
            trim: true
        },
        image: {
            type: String,
            trim: true
        },
        likes: [{
            type: Schema.Types.ObjectId,
            ref: "User",
            default: []
        }],
        comments: [{
            type: Schema.Types.ObjectId,
            ref: "Comment",
            default: []
        }],
        share_count: {
            type: Number,
            default: 0
        },
        views: {
            type: Number,
            default: 0
        },
        hashtags: [{
            type: String,
            trim: true
        }],
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        is_blocked: {
            type: Boolean,
            default: false
        },
        is_archived: {
            type: Boolean,
            default: false
        },
        is_sensitive: {
            type: Boolean,
            default: false
        },
    },
    {
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at"
        },
    }
);

// Custom validation: either content or image is required
PostSchema.pre("validate", function (next) {
    if (!this.content && !this.image) {
        return next(new Error("Either content or image is required."));
    }
    next();
});

// Post Model
const Post = mongoose.models.Post || mongoose.model<IPostDocument>("Post", PostSchema);

export default Post;