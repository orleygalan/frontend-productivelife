import { useAuthStore } from "@/store/authStore";
import axios from "axios";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
})

// Adjunta el token automaticamente con el interceptors de request 
api.interceptors.request.use((config) => {
    const token = useAuthStore.getState().token;

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
})

// Si el token expira, limpia la sesion con el interceptors de response
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const isLoginRoute = error.config?.url?.includes('/auth/login');

        if (error.response?.status === 401 && !isLoginRoute) {
            useAuthStore.getState().clearAuth();
            window.location.href = '/login';
        }

        return Promise.reject(error);
    }
)

export default api;