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
    // Handle common errors globally (e.g., 401, 500)
    return Promise.reject(error)
  }
)

export default apiInstance
