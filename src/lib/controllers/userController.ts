import User, { IUser, IUserDocument } from "@/models/User";
import { connectDB } from "../mongoose";
import { NotFoundError } from "../errors/ApiErrors";
import { FilterQuery } from "mongoose";
import { sanitizeUser } from "@/utils/user";

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

    const user: IUserDocument | null = await User.findOne(query);
    if (!user) throw new NotFoundError('User not found')

    return sanitizeUser(user, role)
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
    );

    if (!updatedUser) throw new NotFoundError("User not found");

    return sanitizeUser(updatedUser, 'user')
}