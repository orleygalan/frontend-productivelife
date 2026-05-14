import api from '@/lib/axios';
import { Task, TaskStatus } from '@/types';

export const taskService = {
    getByProject: async (projectId: string): Promise<Task[]> => {
        const res = await api.get(`/projects/${projectId}/tasks`);
        return res.data.data ?? res.data;
    },

    create: async (data: {
        title: string;
        description?: string;
        project_id: string;
        due_date?: string;
    }): Promise<Task> => {
        const res = await api.post('/tasks', data);
        return res.data.data ?? res.data;
    },

    update: async (
        id: string,
        data: { title: string; description?: string; due_date?: string }
    ): Promise<Task> => {
        const res = await api.put(`/tasks/${id}`, data);
        return res.data.data ?? res.data;
    },

    changeStatus: async (id: string, status: TaskStatus): Promise<Task> => {
        const res = await api.patch(`/tasks/${id}/status`, { status });
        return res.data.data ?? res.data;
    },

    delete: async (id: string): Promise<void> => {
        await api.delete(`/tasks/${id}`);
    },
};