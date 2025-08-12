import axios from 'axios'

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

    // Example: Auto-logout on unauthorized
    if (status === 401) {
      // Optionally: clear cookies / token or redirect
      // window.location.href = '/login';
    }

    return Promise.reject(error.response.data.error);
  }
);

export default apiInstance
