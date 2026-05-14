import { Project } from "@/types";
import api from "../axios";

export const projectService = {
    getByTeam: async (teamId: string): Promise<Project[]> => {
        const res = await api.get(`/teams/${teamId}/projects`);
        return res.data.data ?? res.data;
    },
    getOne: async (id: string): Promise<Project> => {
        const res = await api.get(`/projects/${id}`);
        return res.data.data ?? res.data;
    },
    create: async (data: {
        name: string;
        description?: string;
        team_id: string;
    }): Promise<Project> => {
        const res = await api.post('/projects', data);
        return res.data.data ?? res.data;
    },
    update: async (
        id: string,
        data: {
            name: string;
            description?: string;
        }): Promise<Project> => {
        const res = await api.put(`/projects/${id}`, data);
        return res.data.data ?? res.data;
    },
    delete: async (id: string): Promise<void> => {
        await api.delete(`/projects/${id}`);
    },
}