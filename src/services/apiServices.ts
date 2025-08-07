import API_ROUTES from '@/constants/apiRoutes';
import apiInstance from '@/lib/axios';

// 🧑 Auth APIs
export const authService = {
    register: (data: any) => apiInstance.post(API_ROUTES.AUTH.REGISTER, data),
    login: (data: any) => apiInstance.post(API_ROUTES.AUTH.LOGIN, data),
    refresh: () => apiInstance.get(API_ROUTES.AUTH.REFRESH),
    logout: () => apiInstance.post(API_ROUTES.AUTH.LOGOUT),

    requestReset: (email: string) => apiInstance.post(API_ROUTES.AUTH.REQUEST_RESET, { email }),
    resetPassword: (token: string, newPassword: string) =>
        apiInstance.patch(API_ROUTES.AUTH.RESET_PASSWORD, { token, newPassword }),

    sendOtp: (data: any) => apiInstance.post(API_ROUTES.AUTH.SEND_OTP, data),
    verifyOtp: (data: any) => apiInstance.post(API_ROUTES.AUTH.VERIFY_OTP, data),

    getAuthenticatedUser: () => apiInstance.get(API_ROUTES.AUTH.GET_AUTHENTICATE_USER),
};

// 👤 User APIs
export const userService = {
    getAll: () => apiInstance.get(API_ROUTES.USER.ROOT),
    getById: (id: string) => apiInstance.get(API_ROUTES.USER.BY_ID(id)),
    getProfile: (username: string) => apiInstance.get(API_ROUTES.USER.GET_PROFILE(username)),
    getPosts: (username: string) => apiInstance.get(API_ROUTES.USER.GET_POSTS(username)),
    follow: (username: string) => apiInstance.post(API_ROUTES.USER.FOLLOW(username)),
    unfollow: (username: string) => apiInstance.post(API_ROUTES.USER.UNFOLLOW(username)),
    followers: (username: string) => apiInstance.get(API_ROUTES.USER.FOLLOWERS(username)),
    following: (username: string) => apiInstance.get(API_ROUTES.USER.FOLLOWING(username)),
};

// 📝 Post APIs
export const postService = {
    create: (data: any) => apiInstance.post(API_ROUTES.POSTS.CREATE, data),
    getFeed: () => apiInstance.get(API_ROUTES.POSTS.FEED),
    explore: () => apiInstance.get(API_ROUTES.POSTS.EXPLORE),
    getById: (id: string) => apiInstance.get(API_ROUTES.POSTS.GET(id)),
    delete: (id: string) => apiInstance.delete(API_ROUTES.POSTS.DELETE(id)),
    update: (id: string, data: any) => apiInstance.put(API_ROUTES.POSTS.UPDATE(id), data),
};

// ❤️ Interaction APIs
export const interactionService = {
    like: (postId: string) => apiInstance.post(API_ROUTES.INTERACTION.LIKE(postId)),
    unlike: (postId: string) => apiInstance.post(API_ROUTES.INTERACTION.UNLIKE(postId)),
    likes: (postId: string) => apiInstance.get(API_ROUTES.INTERACTION.LIKES(postId)),

    addComment: (postId: string, comment: string) =>
        apiInstance.post(API_ROUTES.INTERACTION.ADD_COMMENT(postId), { comment }),
    getComments: (postId: string) => apiInstance.get(API_ROUTES.INTERACTION.GET_COMMENTS(postId)),
    deleteComment: (postId: string, commentId: string) =>
        apiInstance.delete(API_ROUTES.INTERACTION.DELETE_COMMENT(postId, commentId)),
};

// 🔍 Search APIs
export const searchService = {
    searchUsers: (key: string, page = 1, prev = false) =>
        apiInstance.get(API_ROUTES.SEARCH.USERS(key, page, prev)),
    searchPosts: (tag: string, page = 1) =>
        apiInstance.get(API_ROUTES.SEARCH.POSTS(tag, page)),
};

// 🔔 Notification APIs
export const notificationService = {
    getAll: () => apiInstance.get(API_ROUTES.NOTIFICATIONS.GET),
    markAsRead: () => apiInstance.patch(API_ROUTES.NOTIFICATIONS.MARK_AS_READ),
};

// 💬 Chat APIs
export const chatService = {
    sendMessage: (receiverId: string, message: string) =>
        apiInstance.post(API_ROUTES.CHAT.CREATE(receiverId), { message }),
    getMessages: (receiverId: string, skip = 0) =>
        apiInstance.get(API_ROUTES.CHAT.GET(receiverId, skip)),
    deleteMessage: (id: string) => apiInstance.delete(API_ROUTES.CHAT.DELETE(id)),
};
