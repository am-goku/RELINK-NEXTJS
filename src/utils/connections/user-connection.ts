import { SanitizedUser, ShortUser } from "../sanitizer/user";

export function toggleFollower(
  setUser: React.Dispatch<React.SetStateAction<SanitizedUser | null>> | undefined,
  user: SanitizedUser
) {
  setUser?.((prev) => {
    if (!prev) return prev;

    const isAlreadyFollowing = prev.followers.some(
      (f) =>
        typeof f === "string"
          ? f === user._id.toString()
          : f._id === user._id.toString()
    );

    const connection: ShortUser = {
      _id: user._id.toString(),
      username: user.username,
      name: user.name,
      image: user.image,
    };

    return {
      ...prev,
      followers: isAlreadyFollowing
        ? prev.followers.filter((f) =>
          typeof f === "string" ? f !== user._id.toString() : f._id !== user._id.toString()
        )
        : [...prev.followers, connection],
      followersCount: isAlreadyFollowing
        ? prev.followersCount - 1
        : prev.followersCount + 1,
    };
  });
}


export function hasConnection(connections: ShortUser[], id: string): boolean {
  return connections.some((conn) => conn._id.toString() === id.toString());
}
