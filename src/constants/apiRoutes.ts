export const API_ROUTES = {
    // 🧑 User Auth & Verification
    AUTH: {
        REGISTER: '/api/auth/register',
        LOGIN: '/api/auth/login',
        REFRESH: '/api/auth/refresh',
        LOGOUT: '/api/auth/logout',

        // Reset Password
        REQUEST_RESET: '/api/auth/request-reset', //POST
        RESET_PASSWORD: '/api/auth/reset-password', //PATCH

        // OTP
        SEND_OTP: '/api/auth/otp/send', //POST
        VERIFY_OTP: '/api/auth/otp/verify', //POST

        GET_AUTHENTICATE_USER: '/api/auth/user',
    },

    USER: {
        ROOT: '/api/users',
        byId: (userId: string) => `/api/users/${userId}`,
        GET_PROFILE: (username: string) => `/api/users/${username}`,
        GET_POSTS: (username: string) => `/api/users/${username}/posts`,
        FOLLOW: (username: string) => `/api/users/${username}/follow`,
        UNFOLLOW: (username: string) => `/api/users/${username}/unfollow`,
        FOLLOWERS: (username: string) => `/api/users/${username}/followers`,
        FOLLOWING: (username: string) => `/api/users/${username}/following`,
    },

    POSTS: {
        CREATE: '/api/posts',
        FEED: '/api/posts',
        EXPLORE: '/api/posts/explore',
        GET: (postId: string) => `/api/posts/${postId}`,
        DELETE: (postId: string) => `/api/posts/${postId}`,
        UPDATE: (postId: string) => `/api/posts/${postId}`,
    },

    INTERACTION: {
        LIKE: (postId: string) => `/api/posts/${postId}/like`,
        UNLIKE: (postId: string) => `/api/posts/${postId}/unlike`,
        LIKES: (postId: string) => `/api/posts/${postId}/likes`,
        ADD_COMMENT: (postId: string) => `/api/posts/${postId}/comments`,
        GET_COMMENTS: (postId: string) => `/api/posts/${postId}/comments`,
        DELETE_COMMENT: (postId: string, commentId: string) =>
            `/api/posts/${postId}/comments/${commentId}`,
    },

    SEARCH: {
        USERS: (key: string, page: number = 1) => `/api/users/search?searchKey=${key}&page=${page}`,
        POSTS: (tag: string, page: number = 1) => `/api/posts/search?tag=${tag}&page=${page}`,
    },

    NOTIFICATIONS: {
        GET: '/api/notifications',
        MARK_AS_READ: '/api/notifications/mark-read',
    },

    CHAT: {
        CREATE: (receiverId: string) => `/api/chat/${receiverId}`,
        GET: (receiverId: string, skip: number = 0) => `/api/chat/${receiverId}?skip=${skip}`,
        DELETE: (id: string) => `/api/chat/${id}`,
    }
}
