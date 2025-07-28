import { IUser, IUserDocument } from "@/models/User";

/**
 * Sanitizes a user object by selecting specific fields based on the user's role.
 *
 * @param user - The user document to be sanitized.
 * @param role - The role of the user, which determines the fields to be included.
 * @returns A sanitized user object containing common fields for all users.
 *          If the role is 'admin' or 'super-admin', additional fields such as
 *          email, blocked status, deleted status, and otp are included.
 */

export function sanitizeUser(user: IUserDocument, role: IUser['role'] = 'user') {
    const baseUser = {
        _id: user._id,
        username: user.username,
        role: user.role,
        name: user.name,
        bio: user.bio,
        gender: user.gender,
        image: user.image,
        cover: user.cover,
        links: user.links,
        accountType: user.accountType,
        messageFrom: user.messageFrom,
        onlineStatus: user.onlineStatus,
        created_at: user.created_at,
        updated_at: user.updated_at,
        followersCount: user.followers?.length || 0,
        followingCount: user.following?.length || 0,
    };

    if (role === 'admin' || role === 'super-admin') {
        return {
            ...baseUser,
            email: user.email,
            blocked: user.blocked,
            deleted: user.deleted,
            otp: user.otp,
        };
    }

    return baseUser;
}