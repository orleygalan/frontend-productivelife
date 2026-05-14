import { AuthResponse, User } from "@/types";
import api from "../axios";

export const authService = {
    register: async (data: {
        name: string;
        email: string;
        password: string;
        password_confirmation: string;
    }): Promise<AuthResponse> => {
        const res = await api.post('/auth/register', data);
        return res.data;
    },
    login: async (data: {
        email: string;
        password: string;
    }): Promise<AuthResponse> => {
        const res = await api.post('/auth/login', data);
        return res.data;
    },
    logout: async (): Promise<void> => {
        await api.post('/auth/logout');
    },
    getProfile: async (): Promise<User> => {
        const res = await api.get('/auth/profile');
        return res.data;
    },
    switchMode: async (mode: 'work' | 'life'): Promise<User> => {
        const res = await api.patch('auth/mode', { mode });
        return res.data.user;
    },
}