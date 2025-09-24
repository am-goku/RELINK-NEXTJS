import mongoose, { Schema, Document, Model, Types } from "mongoose";

// Instance interface (a single hashtag document)
export interface IHashtag extends Document {
    _id: Types.ObjectId;
    tag: string;
    postsCount: number;
    lastUsed: Date;
    posts: Types.ObjectId[];
    created_at: Date;
    updated_at: Date;
}

// Static methods interface
export interface IHashtagModel extends Model<IHashtag> {
    incrementUsage(tag: string, postId: Types.ObjectId): Promise<IHashtag>;
    getTrending(limit?: number): Promise<IHashtag[]>;
}

const HashtagSchema = new Schema<IHashtag>(
    {
        tag: {
            type: String,
            required: true,
            unique: true,
            index: true,
            lowercase: true,
            trim: true,
        },
        postsCount: { type: Number, default: 0, index: true },
        lastUsed: { type: Date, default: Date.now, index: true },
        posts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
    },
    { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

// --- Define statics ---
HashtagSchema.statics.incrementUsage = async function (tag: string, postId: Types.ObjectId) {
    const normalized = tag.toLowerCase().trim();
    return this.findOneAndUpdate(
        { tag: normalized },
        {
            $inc: { postsCount: 1 },
            $set: { lastUsed: new Date() },
            $addToSet: { posts: postId },
        },
        { upsert: true, new: true }
    );
};

HashtagSchema.statics.getTrending = async function (limit = 10) {
    return this.find()
        .sort({ postsCount: -1, lastUsed: -1 })
        .limit(limit)
        .select("tag postsCount lastUsed");
};

// --- Correct model typing ---
export const Hashtag =
    (mongoose.models.Hashtag as IHashtagModel) ||
    mongoose.model<IHashtag, IHashtagModel>("Hashtag", HashtagSchema);
