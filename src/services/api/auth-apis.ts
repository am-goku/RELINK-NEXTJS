import apiInstance from "@/lib/axios";

export const register_user = async (data: { email: string, username: string, password: string }) => {
    try {
        const res = await apiInstance.post(`/api/users`, data);

        return {
            message: res.data.message,
            user: res.data.user
        }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        throw (error?.response?.data);
    }
}