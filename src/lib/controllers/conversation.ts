import User, { IUser } from "@/models/User"; // adjust path to your User model
import { Types } from "mongoose";
import { connectDB } from "../db/mongoose";

export async function getChatSuggestions(userId: string) {
    await connectDB();

    // fetch current user with followers & following
    const currentUser = await User.findById(userId).select("followers following");
    if (!currentUser) return [];

    // merge followers + following into one set
    const candidatesIds = [
        ...new Set([
            ...currentUser.followers.map((id: Types.ObjectId) => id.toString()),
            ...currentUser.following.map((id: Types.ObjectId) => id.toString()),
        ]),
    ].filter((id) => id !== userId); // exclude self

    if (!candidatesIds.length) return [];

    // fetch candidates with rules applied
    let candidates = await User.find({
        _id: { $in: candidatesIds },
        blocked: false,
        deleted: false,
        messageFrom: { $ne: "none" },
    })
        .select("_id name username image messageFrom followers")
        .lean<IUser[]>();

    // filter based on messageFrom
    candidates = candidates.filter((u: IUser) => {
        if (u.messageFrom === "everyone") return true;
        if (u.messageFrom === "followers") {
            return u.followers.some((fid) => fid.toString() === userId);
        }
        return false;
    });

    // randomize + take 10
    const result = candidates
        .sort(() => Math.random() - 0.5)
        .slice(0, 10)
        .map((u: IUser) => ({
            _id: u._id.toString(),
            name: u.name,
            username: u.username,
            image: u.image,
        }));

    return result;
}
