import api from '@/lib/axios';
import { Reward } from '@/types';

export const rewardService = {
    getAll: async (): Promise<Reward[]> => {
        const res = await api.get('/rewards');
        return res.data.data ?? res.data;
    },

    create: async (data: { name: string; points_cost: number }): Promise<Reward> => {
        const res = await api.post('/rewards', data);
        return res.data.data ?? res.data;
    },

    update: async (
        id: string,
        data: { name: string; points_cost: number }
    ): Promise<Reward> => {
        const res = await api.put(`/rewards/${id}`, data);
        return res.data.data ?? res.data;
    },

    redeem: async (id: string): Promise<void> => {
        await api.post(`/rewards/${id}/redeem`);
    },

    delete: async (id: string): Promise<void> => {
        await api.delete(`/rewards/${id}`);
    },
};