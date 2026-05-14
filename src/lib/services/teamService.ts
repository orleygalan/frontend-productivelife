import { Team } from "@/types";
import api from "../axios"

export const teamService = {
    getAll: async (organizationId: string): Promise<Team[]> => {
        const res = await api.get(`/organizations/${organizationId}/teams`);
        return res.data.data ?? res.data;
    },
    getOne: async (id: string): Promise<Team> => {
        const res = await api.get(`/teams/${id}`)
        return res.data.data ?? res.data;
    },
    create: async (data: { name: string; organization_id: string }): Promise<Team> => {
        const res = await api.post(`/teams`, data);
        return res.data.data ?? res.data
    },
    update: async (id: string, data: { name: string }): Promise<Team> => {
        const res = await api.put(`/teams/${id}`, data);
        return res.data.data ?? res.data;
    },
    delete: async (id: string): Promise<void> => {
        await api.delete(`/teams/${id}`);
    },
    addMember: async (
        teamId: string,
        data: { email: string; role: 'admin' | 'editor' | 'viewer' }
    ): Promise<void> => {
        await api.post(`/teams/${teamId}/members`, data);
    },

    removeMember: async (teamId: string, userId: string): Promise<void> => {
        await api.delete(`/teams/${teamId}/members/${userId}`);
    },
}