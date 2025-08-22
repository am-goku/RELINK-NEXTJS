import { SanitizedUser } from "../sanitizer/user";

export type FollowerUser = {
  _id: string;
  username: string;
  name: string;
  image: string;
};

export function toggleFollower(
  setUser: React.Dispatch<React.SetStateAction<SanitizedUser | null>> | undefined,
  user: FollowerUser
) {
  setUser?.((prev) => {
    if (!prev) return prev;

    const isAlreadyFollowing = prev.followers.some(
      (f) => f._id.toString() === user._id.toString()
    );

    return {
      ...prev,
      followers: isAlreadyFollowing
        ? prev.followers.filter((f) => f._id !== user._id) // remove the user
        : [...prev.followers, user] // add the full user object
    };
  });
}
