export const API_ROUTES = {
    // 🧑 User Auth & Verification
    AUTH: {
        REGISTER: '/api/auth/register',
        LOGIN: '/api/auth/login',
        REFRESH: '/api/auth/refresh',
        LOGOUT: '/api/auth/logout',
        VERIFY_EMAIL: '/api/auth/verify-email',
        CONFIRM_EMAIL: '/api/auth/confirm-email',
        FORGOT_PASSWORD: '/api/auth/forgot-password',
        RESET_PASSWORD: '/api/auth/reset-password',

        GET_AUTHENTICATE_USER: '/api/auth/user',
    },

    // 👤 User
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

    // 🖼️ Posts
    POSTS: {
        CREATE: '/api/posts',
        FEED: '/api/posts',
        EXPLORE: '/api/posts/explore',
        GET: (postId: string) => `/api/posts/${postId}`,
        DELETE: (postId: string) => `/api/posts/${postId}`,
        UPDATE: (postId: string) => `/api/posts/${postId}`,
    },

    // 💬 Likes & Comments
    INTERACTION: {
        LIKE: (postId: string) => `/api/posts/${postId}/like`,
        UNLIKE: (postId: string) => `/api/posts/${postId}/unlike`,
        LIKES: (postId: string) => `/api/posts/${postId}/likes`,
        ADD_COMMENT: (postId: string) => `/api/posts/${postId}/comments`,
        GET_COMMENTS: (postId: string) => `/api/posts/${postId}/comments`,
        DELETE_COMMENT: (postId: string, commentId: string) =>
            `/api/posts/${postId}/comments/${commentId}`,
    },

    // 🔍 Search
    SEARCH: {
        USERS: (query: string, page = 1) => `/api/search/users?q=${query}&page=${page}`,
        POSTS: (tags: string, page = 1) => `/api/search/posts?tags=${tags}&page=${page}`,
    },

    // 🔔 Notifications
    NOTIFICATIONS: {
        GET: '/api/notifications',
        MARK_AS_READ: '/api/notifications/mark-read',
    },
}
