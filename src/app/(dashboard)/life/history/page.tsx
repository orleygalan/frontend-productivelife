'use client';

import { useQuery } from '@tanstack/react-query';
import { pointService } from '@/lib/services/pointService';
import { BarChart3, Check, Flame, Gift } from 'lucide-react';
import LoadingCards from '@/components/ui/LoadingCards';

const typeConfig = {
    daily_task: {
        label: 'Tarea diaria',
        color: 'text-blue-600',
        bg: 'bg-blue-50',
        icon: <Check />
    },
    streak_bonus: {
        label: 'Bonus de racha',
        color: 'text-orange-600',
        bg: 'bg-orange-50',
        icon: <Flame />
    },
    reward_redeem: {
        label: 'Recompensa canjeada',
        color: 'text-red-500',
        bg: 'bg-red-50',
        icon: <Gift />
    },
};

export default function HistoryPage() {
    const { data: logs = [], isLoading } = useQuery({
        queryKey: ['point-logs'],
        queryFn: pointService.getLogs,
    });

    return (
        <div className="max-w-2xl mx-auto pt-10 md:pt-0">
            {/* <LifeStats /> */}

            <div className="mb-6">
                <h1 className="text-2xl font-bold text-[#CBD5E1] ">
                    Historial de puntos
                </h1>
                <p className="text-[#CBD5E1]/70 text-sm mt-1">
                    Registro detallado de todos tus puntos ganados y gastados
                </p>
            </div>

            {isLoading ? (
                <LoadingCards />
            ) : logs.length === 0 ? (
                <div className="text-center py-16 border-2 border-dashed border-gray-100 rounded-xl">
                    <BarChart3 className="text-3xl mb-2" />
                    <p className="text-gray-400 text-sm">
                        Aún no tienes movimientos de puntos.
                    </p>
                </div>
            ) : (
                <div className="space-y-2">
                    {logs.map((log) => {
                        const config = typeConfig[log.type];
                        const isGain = log.amount > 0;

                        return (
                            <div
                                key={log.id}
                                className="bg-[#463671]/30 rounded-xl px-2 py-3 flex items-center gap-4"
                            >
                                {/* Icono */}
                                {/* <div className={`w-9 h-9 rounded-full ${config.bg} flex items-center justify-center shrink-0`}>
                                    <span className="text-base">{config.icon}</span>
                                </div> */}

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium text-[#CBD5E1]/50 truncate">
                                        {log.description}
                                    </p>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <span className={`text-xs ${config.color}`}>
                                            {config.label}
                                        </span>
                                        {log.goal && (
                                            <>
                                                <span className="text-gray-300">·</span>
                                                <span className="text-xs text-gray-400 truncate">
                                                    {log.goal.title}
                                                </span>
                                                {/* Puntos */}
                                                <div className="text-right shrink-0 flex gap-1">
                                                    <p className={`text-xs font-bold ${isGain ? 'text-green-600' : 'text-red-500'
                                                        }`}>
                                                        {isGain ? '+' : ''}{log.amount.toLocaleString()}
                                                    </p>
                                                    <p className="text-xs text-gray-400">XP</p>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-300 mt-0.5">
                                        {new Date(log.created_at).toLocaleDateString('es-CO', {
                                            day: '2-digit',
                                            month: 'short',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}