import axios from 'axios';

// 1. Create a custom Axios instance
const api = axios.create({
    baseURL: 'http://localhost:8000/api/', // Your Django API URL
});

// 2. Add the Interceptor
api.interceptors.request.use(
    (config) => {
        // Look in localStorage for the access token
        const token = localStorage.getItem('access');

        // If it exists, attach it to the Authorization header
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
