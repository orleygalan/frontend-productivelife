import api from '@/lib/axios';
import { UserPoints, PointLog } from '@/types';

export const pointService = {
    getBalance: async (): Promise<UserPoints> => {
        const res = await api.get('/points/balance');
        return res.data;
    },

    getLogs: async (): Promise<PointLog[]> => {
        const res = await api.get('/points/logs');
        return res.data.data ?? res.data;
    },
};