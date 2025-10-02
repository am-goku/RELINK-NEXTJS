import User, { IUser, IUserDocument } from "@/models/User";
import { connectDB } from "../db/mongoose";
import { BadRequestError, NotFoundError, UnauthorizedError } from "../errors/ApiErrors";
import { FilterQuery, Types } from "mongoose";
import { sanitizeUser } from "@/utils/sanitizer/user";
import { hashPassword } from "../hash";
import { UploadResult, uploadToCloudinary } from "../cloudinary/cloudinaryUpload";
import { UnverifiedUser } from "@/models/UnverifiedUsers";



export async function getUserById(
    userId: string,
    role: IUser['role'] = 'user'
) {

    if (!userId) throw new NotFoundError('User ID not found')

    await connectDB()

    const query: FilterQuery<IUserDocument> = { _id: userId };

    if (role === 'user') {
        query.blocked = { $ne: true };
        query.deleted = { $ne: true };
        query.role = 'user';
    }

    const user: IUserDocument | null = await User.findOne(query);
    if (!user) throw new NotFoundError('User not found');

    return sanitizeUser(user, role);
}



export async function getUserByUsername(
    username: string,
    role: IUser['role'] = 'user'
) {
    if (!username) throw new NotFoundError('Username is required')

    await connectDB()

    // Build query conditionally (avoid undefined keys)
    const query: FilterQuery<IUserDocument> = { username };

    if (role === 'user') {
        query.blocked = { $ne: true };
        query.deleted = { $ne: true };
        query.role = 'user';
    }

    const user = await User.findOne(query).lean<IUser>();

    if (!user) throw new NotFoundError('User not found')

    return sanitizeUser(user, role)
}



export async function updateUserProfile({ email, data }: {
    email: string;
    data: Record<string, unknown>;
}) {
    if (!email) throw new NotFoundError("User email is required");

    const allowedFields = ["name", "bio", "username", "gender"];

    await connectDB();

    const updates: Record<string, unknown> = {};

    // Only allow specific fields, collect disallowed ones
    const disallowedFields: string[] = [];
    for (const key of Object.keys(data)) {
        if (allowedFields.includes(key)) {
            updates[key] = data[key];
        } else {
            disallowedFields.push(key);
        }
    }

    // Explicitly reject any disallowed fields
    if (disallowedFields.length > 0) {
        throw new Error(`Attempt to update disallowed fields: ${disallowedFields.join(", ")}`);
    }

    // Check for unique username manually (before update)
    if (updates.username) {
        const existing = await User.findOne({ username: updates.username });
        if (existing && existing.email !== email) {
            throw new Error("Username already taken");
        }
    }

    const updatedUser = await User.findOneAndUpdate(
        { email },
        updates,
        { new: true }
    ).lean<IUser>();

    if (!updatedUser) throw new NotFoundError("User not found");

    return sanitizeUser(updatedUser, 'user')
}



export async function updatePassword(password: string, userId: string) {
    await connectDB();

    const hashedPassword = await hashPassword(password);

    const user = await User.findOneAndUpdate(
        { _id: userId },
        { password: hashedPassword },
    );

    if (!user) throw new BadRequestError("User not found");

    return sanitizeUser(user, 'user');
}



export async function searchUser(user_id: string, searchKey: string | null, page: number = 1, prev: 'true' | 'false' = 'false') {
    await connectDB();

    if (!searchKey || !searchKey.trim()) return [];

    const limit = prev == 'true' ? 4 : 15;
    const skip = (page - 1) * limit;

    const users = await User.find({
        _id: { $ne: new Types.ObjectId(user_id) },
        blocked: { $ne: true },
        deleted: { $ne: true },
        role: 'user',
        $or: [
            { username: { $regex: `^${searchKey.trim()}`, $options: 'i' } }, // prefix match
            { name: { $regex: searchKey.trim(), $options: 'i' } }            // optional full name match
        ]
    }).skip(skip).limit(limit); // Optional: limit to prevent abuse

    return users.map(user => sanitizeUser(user, 'user'));
}



export async function getAuthenticatedUserById(id: string) {
    await connectDB();

    const user: IUser | null = await User.findById(id)
        .populate({ path: "followers", select: "name username _id image" })
        .populate({ path: "following", select: "name username _id image" })
        .lean<IUser>();

    if (!user) throw new UnauthorizedError("User not found");

    return sanitizeUser(user, 'user');
}



export async function updateLinksById(id: string, links: string[]) {
    await connectDB();

    const updatedUser = await User.findByIdAndUpdate(
        id,
        { $set: { links } },
        { new: true } // return the updated document
    ).lean<IUser>();

    if (!updatedUser) throw new NotFoundError("User not found");

    return sanitizeUser(updatedUser, 'user');
}


export async function updateProfilePic(file: File, userId: string) {
    await connectDB();

    const cloudResponse = await uploadToCloudinary(file, 'users/profile_pic') as UploadResult;

    await User.findByIdAndUpdate(userId, { $set: { image: cloudResponse?.url } });

    return cloudResponse.url;
}


export async function updateCoverPic(file: File, userId: string) {
    await connectDB();

    const cloudResponse = await uploadToCloudinary(file, 'users/cover_pic') as UploadResult;

    await User.findByIdAndUpdate(userId, { $set: { cover: cloudResponse?.url } });

    return cloudResponse.url;
}

export async function validateUsername(username: string): Promise<boolean> {
    await connectDB();
    
    const userCount = await User.countDocuments({ username });
    const unverifiedCount = await UnverifiedUser.countDocuments({ username });
    const flag = (userCount === 0 && unverifiedCount === 0);
    return flag;
}