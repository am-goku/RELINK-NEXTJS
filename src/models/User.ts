import bcrypt from "bcryptjs";
import { model, models, Schema, Types } from "mongoose";

export interface IUser {
    _id: Types.ObjectId;
    username: string;
    email: string;
    role: 'user' | 'admin' | 'super-admin';

    name?: string;
    bio?: string;
    gender?: string;
    image?: string;
    cover?: string;
    links?: string[];

    password: string;

    followers: Types.ObjectId[];
    following: Types.ObjectId[];

    blocked?: boolean;
    deleted?: boolean;

    otp?: string;
    otp_expiry?: Date;

    accountType?: 'public' | 'private';
    messageFrom?: 'everyone' | 'followers' | 'none';
    onlineStatus?: boolean;

    created_at?: Date;
    updated_at?: Date;

    // Methods
    compareOTP(enteredOtp: string): Promise<boolean>;
}

export type IUserDocument = Document & IUser;


const accountRelated = {
    accountType: {
        type: String,
        default: 'public'
    },

    messageFrom: {
        type: String,
        default: 'everyone'
    },

    onlineStatus: {
        type: Boolean,
        default: true
    }
}


const UserSchema = new Schema<IUserDocument>(
    {
        name: {
            type: String
        },
        bio: {
            type: String
        },
        gender: {
            type: String
        },
        image: {
            type: String
        },
        cover: {
            type: String
        },
        links: [{
            type: String
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
            type: Boolean
        },
        deleted: {
            type: Boolean
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
        ...accountRelated
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

const User = models.User || model<IUserDocument>("User", UserSchema);
export default User;