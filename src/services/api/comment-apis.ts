import apiInstance from "@/lib/axios";
import { SanitizedComment } from "@/utils/sanitizer/comment";

/**
 * Adds a new comment to a given post.
 *
 * @param {Object} params - An object with the required parameters.
 * @param {string} params.postId - The ID of the post to add the comment to.
 * @param {string} params.content - The content of the comment.
 *
 * @returns {Promise<Object>} - A promise that resolves to the newly created comment.
 *
 * @throws {Error} If there is an error adding the comment.
 */
export async function addComment(params: { postId: string; content: string; }): Promise<SanitizedComment> {
    try {
        const response = await apiInstance.post(`/api/posts/${params.postId}/comments`, {
            content: params.content,
        });
        return response.data.comment;
    } catch (error) {
        console.error("Error adding comment:", error);
        throw error;
    }
}

/**
 * Fetches the comments for a given post.
 *
 * @param {string} postId - The ID of the post to fetch the comments for.
 *
 * @returns {Promise<Object[]>} - A promise that resolves to an array of comment objects.
 *
 * @throws {Error} If there is an error fetching the comments.
 */
export async function fetchComments(postId: string): Promise<SanitizedComment[]> {
    try {
        const response = await apiInstance.get(`/api/posts/${postId}/comments`);
        return response.data.comments;
    } catch (error) {
        console.error("Error fetching comments:", error);
        throw error;
    }
}

export async function addReply(postId: string, commentId: string, content: string) {
    try {
        const res = await apiInstance.post(`/api/posts/${postId}/comments/${commentId}/reply`, {
            content
        });

        return res.data.reply
    } catch (error) {
        console.error("Error adding reply:", error);
        throw error;
    }
}

export async function fetchReply(postId: string, commentId: string) {
    try {
        const res = await apiInstance.get(`/api/posts/${postId}/comments/${commentId}/reply`);
        return res.data.replies;
    } catch (error) {
        console.error("Error adding reply:", error);
        throw error;
    }
}