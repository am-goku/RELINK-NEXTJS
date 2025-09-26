import { IUser, IUserDocument } from "@/models/User";

type BaseSanitizedUser = {
  _id: string;
  username: string;
  role: "user" | "admin" | "super-admin";
  name: string;
  bio: string;
  gender: "male" | "female" | "non-binary" | "other" | "prefer-not-to-say";
  image: string;
  cover: string;
  links: string[];
  accountType: "public" | "private";
  messageFrom: "everyone" | "followers" | "none";
  onlineStatus: boolean;
  created_at: Date;  
  updated_at: Date;
  followers: string[];
  following: string[];
  followersCount: number;
  followingCount: number;
};

type AdminSanitizedUser = BaseSanitizedUser & {
  email: string;
  blocked: boolean;
  deleted: boolean;
};

// Conditional type based on role
export type SanitizedUser<R extends IUser['role'] = 'user'> =
  R extends 'admin' | 'super-admin' ? AdminSanitizedUser : BaseSanitizedUser;

export type ShortUser = Pick<BaseSanitizedUser, "_id" | "username"> &
  Partial<Pick<BaseSanitizedUser, "name" | "image">>;

export function sanitizeUser(
  user: IUserDocument | IUser,
  role: IUser["role"] = "user"
): SanitizedUser<typeof role> {

  const baseUser = {
    _id: user._id.toString(),
    username: user.username,
    role: user.role || "user",
    name: user.name || "",
    bio: user.bio || "",
    gender: user.gender || "prefer-not-to-say",
    image: user.image || "",
    cover: user.cover || "",
    links: user.links || [],
    accountType: user.accountType || "public",
    messageFrom: user.messageFrom || "everyone",
    onlineStatus: user.onlineStatus || true,
    created_at: user.created_at || new Date(),
    updated_at: user.updated_at || new Date(),
    followers: user.followers.map(f => f.toString()) || [],
    following: user.following.map(f => f.toString()) || [],
    followersCount: user.followers?.length || 0,
    followingCount: user.following?.length || 0,
  };

  if (role === "admin" || role === "super-admin") {
    return {
      ...baseUser,
      email: user.email,
      blocked: user.blocked || false,
      deleted: user.deleted || false,
    };
  }

  return baseUser;
}