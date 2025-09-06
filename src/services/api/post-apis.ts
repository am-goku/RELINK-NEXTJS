import apiInstance from "@/lib/axios";
import { getErrorMessage } from "@/lib/errors/errorResponse";
import { IPublicPost } from "@/utils/sanitizer/post";
import { Dispatch, SetStateAction } from "react";

/**
 * Creates a new post.
 *
 * @param {Object} props - The options for this function.
 * @param {string} [props.content] - The content of the post.
 * @param {Blob} [props.file] - The image file for the post.
 * @param {Dispatch<SetStateAction<IPublicPost[]>>} [props.setPost] - The function to call when the post is created. It is given the new post object.
 * @param {Dispatch<SetStateAction<string | null>>} [props.setError] - The function to call when there is an error. It is given the error message.
 * @param {(args?: Record<string, unknown>) => void} [props.doFun] - The function to call when the post is created or there is an error.
 *
 * @returns {Promise<void>} - A promise that resolves when the post is created or there is an error.
 *
 * @throws {Error} If no content or image is provided.
 */
export async function createNewPost({ content, file, setPost, setError, doFun }: {
    content?: string;
    file?: Blob | null;
    setPost?: Dispatch<SetStateAction<IPublicPost[]>>;
    doFun?: (args?: Record<string, unknown>) => void;
    setError?: Dispatch<SetStateAction<string | null>>;
}): Promise<void> {
    try {
        // Throw an error if no content or image is provided
        if ((!content || !content?.trim()) && !file) throw new Error("No content or image provided");

        const formData = new FormData();    // New FormData object

        // Append the form data to the FormData object
        if (content?.trim()) formData.append('content', content.trim());
        if (file) formData.append('file', file);

        const res = (await apiInstance.post('/api/posts', formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        })).data;

        setPost?.((prev: IPublicPost[]) => [res.post, ...prev])

    } catch (error) {
        setError?.(getErrorMessage(error) || "Something went wrong. Please try again.");
    } finally {
        doFun?.()
    }
}

/**
 * Fetches all the posts of a user with the given username and updates the UI state accordingly.
 * @param {{ username: string, setResponse: Dispatch<SetStateAction<IPublicPost[]>>, setError: Dispatch<SetStateAction<string>>, setLoading?: Dispatch<SetStateAction<boolean>> }} props - The props to fetch the user's posts.
 * @prop {string} username - The username of the user whose posts are to be fetched.
 * @prop {Dispatch<SetStateAction<IPublicPost[]>>} setResponse - The function to update the response state.
 * @prop {Dispatch<SetStateAction<string>>} setError - The function to update the error state.
 * @prop {Dispatch<SetStateAction<boolean>>} setLoading - The function to update the loading state. Optional.
 */
export async function getPostsByUsername({ username, setResponse, setError, setLoading }: {
    username: string,
    setResponse: Dispatch<SetStateAction<IPublicPost[]>>,
    setError: Dispatch<SetStateAction<string>>,
    setLoading?: Dispatch<SetStateAction<boolean>>
}) {
    try {
        setLoading?.(true);
        const res = (await apiInstance.get(`/api/users/${username}/posts`)).data;
        setResponse(res.posts);
    } catch (error) {
        console.log(error)
        setError(getErrorMessage(error) || "Something went wrong. Please try again.");
    } finally {
        setLoading?.(false);
    }
}

export async function fetchDashboardPosts(): Promise<IPublicPost[]> {
    const res = await apiInstance.get("/api/posts");
    return res.data.posts || [];
}
