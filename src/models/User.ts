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

    accountType?: 'public' | 'private';
    messageFrom?: 'everyone' | 'followers' | 'none';
    onlineStatus?: boolean;

    createdAt?: Date;
    updatedAt?: Date;
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
        otp: {
            type: String
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

const User = models.User || model<IUserDocument>("User", UserSchema);
export default User;