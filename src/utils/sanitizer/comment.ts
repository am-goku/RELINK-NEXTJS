import { ICommentDocument } from "@/models/Comment";
import { IUserDocument } from "@/models/User";

type PopulatedUser = Pick<IUserDocument, "_id" | "name" | "username" | "image">;

type PopulatedComment = Omit<ICommentDocument, "user"> & {
    user: PopulatedUser;
};

export function sanitizeComment(comment: PopulatedComment & { user: PopulatedUser }) {
    return {
        _id: comment._id.toString(),
        comment: comment.comment,
        post: comment.post.toString(),
        user: {
            _id: comment.user._id.toString(),
            name: comment.user.name,
            username: comment.user.username,
            image: comment.user.image,
        },
        created_at: comment.created_at,
        updated_at: comment.updated_at,
    };
}