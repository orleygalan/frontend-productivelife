import api from '@/lib/axios';
import { Goal, GoalTask, TodayTask, UserPoints } from '@/types';

export const goalService = {
    // Listar todas las metas
    getAll: async (): Promise<Goal[]> => {
        const res = await api.get('/goals');
        return res.data.data ?? res.data;
    },

    // Obtener una meta
    getOne: async (id: string): Promise<Goal> => {
        const res = await api.get(`/goals/${id}`);
        return res.data.data ?? res.data;
    },

    // Crear meta con sus tareas
    create: async (data: {
        title: string;
        description?: string;
        start_date: string;
        end_date: string;
        tasks: { title: string; xp_per_day: number }[];
    }): Promise<Goal> => {
        const res = await api.post('/goals', data);
        return res.data.data ?? res.data;
    },

    // Actualizar meta
    update: async (
        id: string,
        data: { title?: string; description?: string; end_date?: string }
    ): Promise<Goal> => {
        const res = await api.put(`/goals/${id}`, data);
        return res.data.data ?? res.data;
    },

    // Eliminar meta
    delete: async (id: string): Promise<void> => {
        await api.delete(`/goals/${id}`);
    },

    // Obtener tareas del día de una meta
    getToday: async (goalId: string): Promise<{
        goal: Goal;
        tasks: TodayTask[];
        balance: number;
    }> => {
        const res = await api.get(`/goals/${goalId}/today`);
        return res.data;
    },

    // Completar tarea diaria
    completeTask: async (goalId: string, taskId: string): Promise<void> => {
        await api.post(`/goals/${goalId}/tasks/${taskId}/complete`);
    },

    // Descompletar tarea diaria
    uncompleteTask: async (goalId: string, taskId: string): Promise<void> => {
        await api.delete(`/goals/${goalId}/tasks/${taskId}/complete`);
    },

    // Agregar tarea a meta existente
    addTask: async (
        goalId: string,
        data: { title: string; xp_per_day: number }
    ): Promise<GoalTask> => {
        const res = await api.post(`/goals/${goalId}/tasks`, data);
        return res.data.data ?? res.data;
    },

    // Actualizar tarea
    updateTask: async (
        goalId: string,
        taskId: string,
        data: { title?: string; xp_per_day?: number }
    ): Promise<GoalTask> => {
        const res = await api.put(`/goals/${goalId}/tasks/${taskId}`, data);
        return res.data.data ?? res.data;
    },

    // Eliminar tarea
    deleteTask: async (goalId: string, taskId: string): Promise<void> => {
        await api.delete(`/goals/${goalId}/tasks/${taskId}`);
    },
};