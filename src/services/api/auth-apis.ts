import apiInstance from "@/lib/axios";
import { getErrorMessage } from "@/lib/errors/errorResponse";

export const register_user = async (data: { email: string, username: string, password: string }) => {
    try {
        const res = await apiInstance.post(`/api/users`, data);

        return {
            message: res.data.message,
            user: res.data.user
        }
    } catch (error) {
        throw (getErrorMessage(error) || "Something went wrong. Please try again.");
    }
}