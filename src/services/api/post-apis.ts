import apiInstance from "@/lib/axios";
import { getErrorMessage } from "@/lib/errors/errorResponse";
import { IPublicPost } from "@/utils/sanitizer/post";


export async function createNewPost({ content, file }: { content?: string; file?: Blob | null }) {
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

        return res.post;
    } catch (error) {
        console.log(error)
        throw getErrorMessage(error) || "Something went wrong. Please try again.";
    }
}

export async function getPostsByUsername({ username }: { username: string }) {
    try {
        const res = (await apiInstance.get(`/api/posts/user?username=${username}`)).data;
        return res
    } catch (error) {
        throw (getErrorMessage(error) || "Something went wrong. Please try again.");
    }
}

export async function fetchDashboardPosts(): Promise<IPublicPost[]> {
    const res = await apiInstance.get("/api/posts");
    return res.data.posts || [];
}
