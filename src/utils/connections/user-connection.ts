import { Types } from "mongoose";
import { ObjectId } from "bson";
import { IUser } from "@/models/User";

export function toggleFollower(
  setUser: React.Dispatch<React.SetStateAction<IUser | null>> | undefined,
  userId: string | Types.ObjectId
) {
  // normalize for comparison
  const userIdStr =
    typeof userId === "string" ? userId : (userId as ObjectId).toString();

  setUser?.((prev) => {
    if (!prev) return prev;

    const isAlreadyFollowing = prev.followers.some(
      (f) => f.toString() === userIdStr
    );

    return {
      ...prev,
      followers: isAlreadyFollowing
        ? prev.followers.filter((f) => f !== userIdStr) // remove
        : [...prev.followers, userIdStr]
    };
  });
}
