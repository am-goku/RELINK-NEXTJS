import bcrypt from "bcryptjs";
import { model, models, Schema, Types } from "mongoose";

export interface IUser {
    _id: Types.ObjectId;
    username: string;
    email: string;
    role: 'user' | 'admin' | 'super-admin';

    name?: string;
    bio?: string;
    gender?: "male" | "female" | "non-binary" | "other" | "prefer-not-to-say";
    image?: string;
    cover?: string;
    links?: string[];

    password: string;

    followers: string[];
    following: string[];

    blocked?: boolean;
    deleted?: boolean;

    otp?: string;
    otp_expiry?: Date;

    accountType: 'public' | 'private';
    messageFrom: 'everyone' | 'followers' | 'none';
    onlineStatus: boolean;

    created_at?: Date;
    updated_at?: Date;

    // Methods
    compareOTP(enteredOtp: string): Promise<boolean>;
}

export type IUserDocument = Document & IUser;


const UserSchema = new Schema<IUserDocument>(
    {
        name: {
            type: String
        },
        bio: {
            type: String
        },
        gender: {
            type: String,
            enum: ["male", "female", "non-binary", "other", "prefer-not-to-say"]
        },
        image: {
            type: String
        },
        cover: {
            type: String
        },
        links: [{
            type: String,
            default: []
        }],

        email: {
            type: String,
            required: true,
            unique: true
        },
        username: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },

        blocked: {
            type: Boolean,
            default: false
        },
        deleted: {
            type: Boolean,
            default: false
        },

        role: {
            type: String,
            default: 'user'
        },

        //OTP
        otp: {
            type: String
        },
        otp_expiry: {
            type: Date
        },

        //Follow and Following
        followers: [{
            type: Schema.Types.ObjectId,
            ref: "User",
            default: []
        }],
        following: [{
            type: Schema.Types.ObjectId,
            ref: "User",
            default: []
        }],

        //Account setting
        accountType: {
            type: String,
            enum: ['public', 'private'],
            default: 'public'
        },

        messageFrom: {
            type: String,
            enum: ['everyone', 'followers', 'none'],
            default: 'everyone'
        },

        onlineStatus: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at"
        },
    }
);

UserSchema.methods.compareOTP = async function (enteredOtp: string): Promise<boolean> {
    return bcrypt.compare(enteredOtp, this.otp);
};

UserSchema.index(
    { _id: 1, accountType: 1, deleted: 1, blocked: 1 },
    { name: "users_author_filter_index" }
);

const User = models.User || model<IUserDocument>("User", UserSchema);
export default User;