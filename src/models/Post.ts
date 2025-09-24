import mongoose, { Schema, Document, Types } from "mongoose";

// Base Post Interface
export interface IPostBase {
    _id: Types.ObjectId;
    content?: string;
    image?: string;
    imageRatio?: "landscape" | "portrait" | "square";
    comments: Types.ObjectId[];
    hashtags: string[];
    author: Types.ObjectId;
    
    // Interactions
    likes: Types.ObjectId[];
    saves: Types.ObjectId[];
    views: Types.ObjectId[];
    share_count: number;

    //Security
    disableComment: boolean;
    disableShare: boolean;

    // Admin fields
    is_blocked: boolean;
    is_archived: boolean;
    is_sensitive: boolean;
    created_at?: Date;
    updated_at?: Date;
}

// For MongoDB Document
export type IPostDocument = IPostBase & Document;


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
        imageRatio: {
            type: String,
            enum: ["landscape", "portrait", "square"]
        },
        likes: [{
            type: Schema.Types.ObjectId,
            ref: "User",
            default: []
        }],
        saves: [{
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
        views: [{
            type: Schema.Types.ObjectId,
            ref: "User",
            default: []
        }],
        hashtags: [{
            type: String,
            trim: true,
            default: []
        }],
        author: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        disableComment: {
            type: Boolean,
            default: false
        },
        disableShare: {
            type: Boolean,
            default: false
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