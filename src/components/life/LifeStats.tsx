'use client';

import { useQuery } from '@tanstack/react-query';
import { pointService } from '@/lib/services/pointService';

export default function LifeStats() {
    const { data: balance } = useQuery({
        queryKey: ['points-balance'],
        queryFn: pointService.getBalance,
    });

    return (
        <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-xl border border-gray-100 p-5 text-center">
                <p className="text-3xl font-bold text-blue-600">
                    {balance?.balance ?? 0}
                </p>
                <p className="text-xs text-gray-400 mt-1">Puntos disponibles</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-5 text-center">
                <p className="text-3xl font-bold text-green-600">
                    {balance?.total_earned ?? 0}
                </p>
                <p className="text-xs text-gray-400 mt-1">Total ganados</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-5 text-center">
                <p className="text-3xl font-bold text-purple-600">
                    {balance?.total_spent ?? 0}
                </p>
                <p className="text-xs text-gray-400 mt-1">Total gastados</p>
            </div>
        </div>
    );
}