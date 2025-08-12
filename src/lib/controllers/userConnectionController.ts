import User from "@/models/User";
import { connectDB } from "../db/mongoose";
import { NotFoundError } from "../errors/ApiErrors";
import mongoose, { Types } from "mongoose";


/**
 * Follow a user.
 * This function will start a Mongoose transaction to ensure that both the follower and followee are updated atomically.
 * If any error occurs during the transaction, it will be rolled back.
 *
 * This function will throw an error if the current user is trying to follow themselves.
 * This function will throw a NotFoundError if either the current user or the followee user is not found.
 *
 * @param c_user - The current user's ID
 * @param f_user - The user to follow's ID
 * @returns { success: boolean, action: string } - An object indicating whether the operation was successful (success) and the action taken (action).
 */

export async function followUser(c_user: string, f_user: string): Promise<{ success: boolean, action: string }> {
    await connectDB();

    if (c_user === f_user) throw new Error('Cannot follow yourself');

    const users = await User.find({ _id: { $in: [c_user, f_user] } });
    if (users.length !== 2) throw new NotFoundError('User not found');

    const c_user_id = new Types.ObjectId(c_user);
    const f_user_id = new Types.ObjectId(f_user);

    // Starting MONGOOSE TRANSACTION for atomicity
    const session = await mongoose.startSession(); // Create a new session for transaction
    session.startTransaction(); // Transaction started

    try {
        await User.updateOne(
            { _id: c_user_id },
            { $addToSet: { following: f_user_id } },
            { session }
        );

        await User.updateOne(
            { _id: f_user_id },
            { $addToSet: { followers: c_user_id } },
            { session }
        );

        await session.commitTransaction();

        return { success: true, action: "followed" }

    } catch (error) {
        await session.abortTransaction();
        throw error
    } finally {
        session.endSession();
    }
}



/**
 * Unfollow a user.
 * This function will start a Mongoose transaction to ensure that both the follower and followee are updated atomically.
 * If any error occurs during the transaction, it will be rolled back.
 *
 * This function will throw an error if the current user is trying to unfollow themselves.
 * This function will throw a NotFoundError if either the current user or the followee user is not found.
 *
 * @param c_user - The current user's ID
 * @param f_user - The user to unfollow's ID
 * @returns { success: boolean, action: string } - An object indicating whether the operation was successful (success) and the action taken (action).
 */
export async function unfollowUser(c_user: string, f_user: string): Promise<{ success: boolean, action: string }> {
    await connectDB();

    if (c_user === f_user) throw new Error('Cannot unfollow yourself');

    const users = await User.find({ _id: { $in: [c_user, f_user] } });
    if (users.length !== 2) throw new NotFoundError('User not found');

    const c_user_id = new Types.ObjectId(c_user);
    const f_user_id = new Types.ObjectId(f_user);

    // Starting MONGOOSE TRANSACTION for atomicity
    const session = await mongoose.startSession(); // Create a new session for transaction
    session.startTransaction(); // Transaction started

    try {
        await User.updateOne(
            { _id: c_user_id },
            { $pull: { following: f_user_id } },
            { session }
        );

        await User.updateOne(
            { _id: f_user_id },
            { $pull: { followers: c_user_id } },
            { session }
        );

        await session.commitTransaction();

        return { success: true, action: "unfollowed" };

    } catch (error) {
        await session.abortTransaction();
        throw error
    } finally {
        session.endSession();
    }
}