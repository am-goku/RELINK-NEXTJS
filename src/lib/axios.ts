import axios from 'axios'
import { signOut } from 'next-auth/react';

const apiInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL, // e.g., http://localhost:3000/api
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Optionally add interceptors
apiInstance.interceptors.response.use(
  response => response,
  error => {
    const status = error.response?.status;

    console.log("Here is the status", status)

    // Example: Auto-logout on unauthorized
    if (status === 401) {
      signOut({ callbackUrl: "/auth/login" });
    }

    return Promise.reject(error);
  }
);

export default apiInstance
