import apiInstance from "@/lib/axios";
import { getErrorMessage } from "@/lib/errors/errorResponse";
import { IPublicPost } from "@/utils/sanitizer/post";

export async function getPostsByUsername({ username, setResponse, setError, setLoading }: {
    username: string,
    setResponse: React.Dispatch<React.SetStateAction<IPublicPost[]>>,
    setError: React.Dispatch<React.SetStateAction<string>>,
    setLoading?: React.Dispatch<React.SetStateAction<boolean>>
}) {
    try {
        setLoading?.(true);
        const res = (await apiInstance.get(`/api/users/${username}/posts`)).data;
        setResponse(res.posts);
    } catch (error) {
        setError(getErrorMessage(error) || "Something went wrong. Please try again.");
    } finally {
        setLoading?.(false);
    }
}