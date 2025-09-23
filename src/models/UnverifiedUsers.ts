import mongoose, { model, models } from "mongoose";

export interface IUnverifiedUser {
    email: string;
    username: string;
    password: string;
    verificationToken: string;
    verificationExpires: Date;
}

export interface IUnverifiedUserDocument extends IUnverifiedUser, mongoose.Document { }

const unverifiedUserSchema = new mongoose.Schema<IUnverifiedUserDocument>({
    email: {
        type: String,
        unique: true,
        required: [true, "Email is required"],
        lowercase: true, // normalize
        trim: true,
        match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
    },
    username: {
        type: String,
        unique: true,
        required: [true, "Username is required"],
        trim: true,
        minlength: [3, "Username must be at least 3 characters"],
        maxlength: [20, "Username cannot exceed 20 characters"],
        match: [/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"],
    },
    password: { type: String, required: [true, "Password is required"] },
    verificationToken: { type: String },
    verificationExpires: { type: Date },
}, {
    timestamps: {
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
});

export const UnverifiedUser = models.UnverifiedUser || model<IUnverifiedUserDocument>("UnverifiedUser", unverifiedUserSchema);
