import User, { IUser, IUserDocument } from "@/models/User";
import { connectDB } from "../mongoose";
import { NotFoundError } from "../errors/ApiErrors";
import { FilterQuery } from "mongoose";

export async function getUserById(
    userId: string,
    role: IUser['role'] = 'user'
) {

    if (!userId) throw new NotFoundError('Username not found')

    await connectDB()

    const query: FilterQuery<IUserDocument> = {
        _id: userId,
        blocked: role === 'user' ? { $ne: true } : undefined,
        deleted: role === 'user' ? { $ne: true } : undefined,
        role: { $in: ['user', null] },
    }

    const user: IUserDocument | null = await User.findOne(query);

    if (!user) throw new NotFoundError('User not found')

    const baseUser = {
        _id: user._id,
        username: user.username,
        role: user.role,
        name: user.name,
        bio: user.bio,
        gender: user.gender,
        image: user.image,
        cover: user.cover,
        links: user.links,
        accountType: user.accountType,
        messageFrom: user.messageFrom,
        onlineStatus: user.onlineStatus,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        followersCount: user.followers?.length || 0,
        followingCount: user.following?.length || 0,
    }

    if (role === 'admin' || role === 'super-admin') {
        return {
            ...baseUser,
            email: user.email,
            blocked: user.blocked,
            deleted: user.deleted,
            otp: user.otp,
        }
    }

    // If role is 'user', hide sensitive fields
    return baseUser
}


export async function getUserByUsername(
    username: string,
    role: IUser['role'] = 'user'
) {
    if (!username) throw new NotFoundError('Username not found')

    await connectDB()

    const query: FilterQuery<IUserDocument> = {
        username: username,
        blocked: role === 'user' ? { $ne: true } : undefined,
        deleted: role === 'user' ? { $ne: true } : undefined,
        role: { $in: ['user', null] },
    }

    const user: IUserDocument | null = await User.findOne(query);

    if (!user) throw new NotFoundError('User not found')

    const baseUser = {
        _id: user._id,
        username: user.username,
        role: user.role,
        name: user.name,
        bio: user.bio,
        gender: user.gender,
        image: user.image,
        cover: user.cover,
        links: user.links,
        accountType: user.accountType,
        messageFrom: user.messageFrom,
        onlineStatus: user.onlineStatus,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        followersCount: user.followers?.length || 0,
        followingCount: user.following?.length || 0,
    }

    if (role === 'admin' || role === 'super-admin') {
        return {
            ...baseUser,
            email: user.email,
            blocked: user.blocked,
            deleted: user.deleted,
            otp: user.otp,
        }
    }

    // If role is 'user', hide sensitive fields
    return baseUser
}



interface UpdateProfileInput {
    email: string;
    data: Record<string, unknown>;
}

const allowedFields = ["name", "bio", "username", "gender", "links"];

export async function updateUserProfile({ email, data }: UpdateProfileInput): Promise<Partial<IUserDocument>> {
    if (!email) throw new NotFoundError("User email is required");

    await connectDB();

    const updates: Record<string, unknown> = {};

    // Enforce whitelist
    for (const field of allowedFields) {
        if (Object.prototype.hasOwnProperty.call(data, field)) {
            updates[field] = data[field];
        }
    }

    // Check for disallowed fields
    const disallowedFields = Object.keys(data).filter(field => !allowedFields.includes(field));
    if (disallowedFields.length > 0) {
        throw new Error(`Attempt to update disallowed fields: ${disallowedFields.join(", ")}`);
    }

    // Unique username check
    if (updates.username) {
        const existing = await User.findOne({ username: updates.username });
        if (existing && existing.email !== email) {
            throw new Error("Username already taken");
        }
    }

    // Update and return safe user
    const updatedUser = await User.findOneAndUpdate(
        { email },
        updates,
        { new: true }
    ).select("-password -otp");

    if (!updatedUser) throw new NotFoundError("User not found");

    return updatedUser.toObject();
}