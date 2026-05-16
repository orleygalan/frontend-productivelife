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
            <div className="bg-[#080F1F] rounded-xl p-5 text-center">
                <p className="sm:text-3xl text-[14px] font-bold text-[#10B981] ">
                    {balance?.balance ?? 0}
                </p>
                <p className="sm:text-xs text-[10px] text-[#10B981] mt-1">Disponibles</p>
            </div>
            <div className="bg-[#080F1F] rounded-xl p-5 text-center">
                <p className="sm:text-3xl text-[14px] font-bold text-[#10B981] ">
                    {balance?.total_earned ?? 0}
                </p>
                <p className="sm:text-xs text-[10px] text-[#10B981] mt-1">Ganados</p>
            </div>
            <div className="bg-[#080F1F] rounded-xl p-5 text-center">
                <p className="sm:text-3xl text-[14px] font-bold text-[#3B6EA8] ">
                    {balance?.total_spent ?? 0}
                </p>
                <p className="sm:text-xs text-[10px] text-[#3B6EA8] mt-1">Gastados</p>
            </div>
        </div>
    );
}