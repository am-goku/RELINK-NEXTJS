import User, { IUser, IUserDocument } from "@/models/User";
import { connectDB } from "../mongoose";
import { BadRequestError, NotFoundError } from "../errors/ApiErrors";
import { FilterQuery } from "mongoose";
import { sanitizeUser } from "@/utils/sanitizer/user";
import { hashPassword } from "../hash";


/**
 * Retrieves a sanitized user object by user ID.
 * 
 * Connects to the database and fetches a user document based on the provided user ID.
 * The user object is filtered based on the role. If the role is 'user', only non-blocked
 * and non-deleted users with the role 'user' are considered.
 * 
 * @param userId - The unique identifier of the user to be fetched.
 * @param role - The role of the requester, which determines the fields to be included in the sanitization. Defaults to 'user'.
 * @returns A sanitized version of the user object, containing only the fields permitted by the user's role.
 * @throws {NotFoundError} If the user ID is not provided or the user is not found.
 */
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


/**
 * Retrieves a sanitized user object by username.
 * 
 * Connects to the database and fetches a user document based on the provided username.
 * The user object is filtered based on the role. If the role is 'user', only non-blocked
 * and non-deleted users with the role 'user' are considered.
 * 
 * @param username - The username of the user to be fetched.
 * @param role - The role of the requester, which determines the fields to be included in the sanitization. Defaults to 'user'.
 * @returns A sanitized version of the user object, containing only the fields permitted by the user's role.
 * @throws {NotFoundError} If the username is not provided or the user is not found.
 */
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


/**
 * Updates a user's profile with the provided data.
 * 
 * This function connects to the database and updates the user's profile fields based on the provided email.
 * Only specific fields (name, bio, username, gender, links) are allowed to be updated. 
 * Fields not permitted for update will result in an error.
 * If the username is provided, it checks for uniqueness before performing the update.
 * 
 * @param email - The email of the user whose profile is to be updated.
 * @param data - An object containing the fields and their new values to update.
 * @returns A Promise that resolves to the sanitized updated user document.
 * @throws {NotFoundError} If the user email is not provided or the user is not found.
 * @throws {Error} If there are attempts to update disallowed fields or the username is already taken.
 */
export async function updateUserProfile({ email, data }: {
    email: string;
    data: Record<string, unknown>;
}): Promise<Partial<IUserDocument>> {
    if (!email) throw new NotFoundError("User email is required");

    const allowedFields = ["name", "bio", "username", "gender", "links"];

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


/**
 * Updates a user's password with the provided value.
 * 
 * Connects to the database and finds the user by ID.
 * Hashes the provided password and updates the user document with the new value.
 * 
 * @param password - The new password to be set for the user.
 * @param userId - The unique identifier of the user whose password is to be updated.
 * @returns A sanitized version of the user object, containing only the fields permitted by the user's role.
 * @throws {BadRequestError} If the user ID is not provided or the user is not found.
 */
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


/**
 * Searches for users by username or full name.
 * 
 * Connects to the database and performs a case-insensitive search for users
 * whose username starts with the provided search key, or whose full name contains
 * the search key.
 * 
 * Results are sorted by username in ascending order and paginated based on the
 * provided page number.
 * 
 * @param searchKey - The search key to be used for the search.
 * @param page - The page number for pagination, defaulting to 1.
 * @returns An array of sanitized user objects.
 */
export async function searchUser(searchKey: string | null, page: number = 1, prev: 'true' | 'false' = 'false') {
    await connectDB();

    if (!searchKey || !searchKey.trim()) return [];

    const limit = prev == 'true' ? 4 : 15;
    const skip = (page - 1) * limit;

    const users = await User.find({
        $or: [
            { username: { $regex: `^${searchKey.trim()}`, $options: 'i' } }, // prefix match
            { name: { $regex: searchKey.trim(), $options: 'i' } }            // optional full name match
        ]
    }).skip(skip).limit(limit); // Optional: limit to prevent abuse

    return users.map(user => sanitizeUser(user, 'user'));
}