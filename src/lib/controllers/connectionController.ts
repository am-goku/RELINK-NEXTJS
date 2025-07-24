import User from "@/models/User";
import { connectDB } from "../mongoose";
import { NotFoundError } from "../errors/ApiErrors";
import { Types } from "mongoose";

export async function followUser(c_user: string, f_user: string): Promise<void> {
    await connectDB();

    const currentUser = await User.findById(c_user);
    const followingUser = await User.findById(f_user);

    if (!currentUser || !followingUser) {
        throw new NotFoundError('User not found');
    }

    const c_user_id = new Types.ObjectId(c_user);
    const f_user_id = new Types.ObjectId(f_user);

    // Use $addToSet to avoid duplicates automatically
    await User.updateOne(
        { _id: c_user_id },
        { $addToSet: { following: f_user_id } }
    );

    await User.updateOne(
        { _id: f_user_id },
        { $addToSet: { followers: c_user_id } }
    );

    return
}

export async function unfollowUser(c_user: string, f_user: string): Promise<void> {
    await connectDB();

    const currentUser = await User.findById(c_user);
    const followingUser = await User.findById(f_user);

    if (!currentUser || !followingUser) {
        throw new NotFoundError('User not found');
    }

    const c_user_id = new Types.ObjectId(c_user);
    const f_user_id = new Types.ObjectId(f_user);

    // Remove f_user from c_user's following
    await User.updateOne(
        { _id: c_user_id },
        { $pull: { following: f_user_id } }
    );

    // Remove c_user from f_user's followers
    await User.updateOne(
        { _id: f_user_id },
        { $pull: { followers: c_user_id } }
    );

    return
}