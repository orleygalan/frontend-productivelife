import { Organization } from "@/types";
import api from "../axios";

export const organizationService = {
    getAll: async (): Promise<Organization[]> => {
        const res = await api.get('/organizations');
        return res.data.data ?? res.data;
    },
    getOne: async (id: string): Promise<Organization> => {
        const res = await api.get(`/organizations/${id}`);
        return res.data.data ?? res.data;
    },
    create: async (data: {
        name: string;
        description?: string;
    }): Promise<Organization> => {
        const res = await api.post('/organizations', data);
        return res.data.data ?? res.data;
    },
    update: async (id: string, data: {
        name: string;
        description?: string;
    }): Promise<Organization> => {
        const res = await api.put(`/organizations/${id}`, data);
        return res.data.data ?? res.data;
    },
    delete: async (id: string): Promise<void> => {
        await api.delete(`/organizations/${id}`);
    },
}