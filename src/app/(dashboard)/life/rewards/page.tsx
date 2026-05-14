'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { rewardService } from '@/lib/services/rewardService';
import { pointService } from '@/lib/services/pointService';
import { Reward } from '@/types';
import Modal from '@/components/ui/Modal';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import RewardForm from '@/components/life/RewardForm';
import LifeStats from '@/components/life/LifeStats';
import { Check, Gem, Gift, Lightbulb, PartyPopper, Pencil, Target, Trash2 } from 'lucide-react';

export default function RewardsPage() {
    const queryClient = useQueryClient();
    const isSunday = new Date().getDay() === 0;

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingReward, setEditingReward] = useState<Reward | null>(null);
    const [deletingReward, setDeletingReward] = useState<Reward | null>(null);
    const [redeemingReward, setRedeemingReward] = useState<Reward | null>(null);

    const { data: rewards = [], isLoading } = useQuery({
        queryKey: ['rewards'],
        queryFn: rewardService.getAll,
    });

    const { data: balance } = useQuery({
        queryKey: ['points-balance'],
        queryFn: pointService.getBalance,
    });

    const currentBalance = balance?.balance ?? 0;

    const createMutation = useMutation({
        mutationFn: rewardService.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['rewards'] });
            setIsCreateOpen(false);
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: { name: string; points_cost: number } }) =>
            rewardService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['rewards'] });
            setEditingReward(null);
        },
    });

    const deleteMutation = useMutation({
        mutationFn: rewardService.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['rewards'] });
            setDeletingReward(null);
        },
    });

    const redeemMutation = useMutation({
        mutationFn: rewardService.redeem,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['rewards'] });
            queryClient.invalidateQueries({ queryKey: ['points-balance'] });
            setRedeemingReward(null);
        },
    });

    const handleEdit = (e: React.MouseEvent, reward: Reward) => {
        e.stopPropagation();
        setDeletingReward(null);
        setEditingReward(reward);
    };

    const handleDelete = (e: React.MouseEvent, reward: Reward) => {
        e.stopPropagation();
        setEditingReward(null);
        setDeletingReward(reward);
    };

    return (
        <div className="max-w-2xl mx-auto">
            <LifeStats />

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Recompensas</h1>
                    {isSunday ? (
                        <p className="text-xs text-green-500 mt-0.5 font-medium flex items-center">
                            <PartyPopper /> ¡Hoy es domingo, puedes canjear!
                        </p>
                    ) : (
                        <p className="text-xs text-gray-400 mt-0.5">
                            Solo se pueden canjear los domingos
                        </p>
                    )}
                </div>
                <button
                    onClick={() => setIsCreateOpen(true)}
                    className="bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
                >
                    + Nueva recompensa
                </button>
            </div>

            {/* Balance actual */}
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-100 p-5 mb-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-500">Tu balance actual</p>
                        <p className="text-3xl font-bold text-purple-700 mt-1">
                            {currentBalance.toLocaleString()} pts
                        </p>
                    </div>
                    <div>
                        <Gem className="w-10 h-10" />
                    </div>
                </div>
                {!isSunday && (
                    <p className="text-xs text-gray-400 mt-3 flex items-center">
                        <Lightbulb className="w-6 h-6" /> Acumula puntos completando tus tareas diarias y canjea cada domingo.
                    </p>
                )}
            </div>

            {/* Lista de recompensas */}
            {isLoading ? (
                <p className="text-gray-400 text-sm">Cargando...</p>
            ) : rewards.length === 0 ? (
                <div className="text-center py-16 border-2 border-dashed border-gray-100 rounded-xl">
                    <p className="mb-2">
                        <Gift className="w-8 h-8" />
                    </p>
                    <p className="text-gray-400 text-sm">No tienes recompensas aún.</p>
                    <button
                        onClick={() => setIsCreateOpen(true)}
                        className="mt-3 text-purple-600 text-xs hover:underline"
                    >
                        Crea una recompensa
                    </button>
                </div>
            ) : (
                <div className="space-y-3">
                    {rewards
                        .sort((a, b) => a.points_cost - b.points_cost)
                        .map((reward) => {
                            const canAfford = currentBalance >= reward.points_cost;
                            const progress = Math.min((currentBalance / reward.points_cost) * 100, 100);

                            return (
                                <div
                                    key={reward.id}
                                    className={`bg-white rounded-xl border p-5 transition-all ${canAfford ? 'border-purple-100' : 'border-gray-100'
                                        }`}
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <p className="text-sm font-semibold text-gray-800">
                                                    {reward.name}
                                                </p>
                                                {canAfford && (
                                                    <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full font-medium">
                                                        <Check size={16} /> Puedes canjear
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm font-bold text-purple-600 mt-1">
                                                <Target className="w-5 h-5" /> {reward.points_cost.toLocaleString()} pts
                                            </p>

                                            {/* Barra de progreso */}
                                            {!canAfford && (
                                                <div className="mt-2">
                                                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                                                        <span>{currentBalance.toLocaleString()} / {reward.points_cost.toLocaleString()}</span>
                                                        <span>{Math.round(progress)}%</span>
                                                    </div>
                                                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-purple-400 rounded-full transition-all"
                                                            style={{ width: `${progress}%` }}
                                                        />
                                                    </div>
                                                    <p className="text-xs text-gray-400 mt-1">
                                                        Te faltan {(reward.points_cost - currentBalance).toLocaleString()} pts
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Acciones */}
                                        <div className="flex flex-col items-end gap-2">
                                            {isSunday && canAfford && (
                                                <button
                                                    onClick={() => setRedeemingReward(reward)}
                                                    className="text-xs px-3 py-1.5 rounded-lg font-medium bg-purple-600 text-white hover:bg-purple-700 transition-colors"
                                                >
                                                    Canjear
                                                </button>
                                            )}
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={(e) => handleEdit(e, reward)}
                                                    className="text-gray-300 hover:text-blue-500 text-xs transition-colors"
                                                >
                                                    <Pencil />
                                                </button>
                                                <button
                                                    onClick={(e) => handleDelete(e, reward)}
                                                    className="text-gray-300 hover:text-red-400 text-xs transition-colors"
                                                >
                                                    <Trash2 />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                </div>
            )}

            {/* Modal Crear */}
            <Modal
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
                title="Nueva recompensa"
            >
                <RewardForm
                    onSubmit={async (data) => { await createMutation.mutateAsync(data); }}
                    onCancel={() => setIsCreateOpen(false)}
                    loading={createMutation.isPending}
                />
            </Modal>

            {/* Modal Editar */}
            <Modal
                isOpen={!!editingReward}
                onClose={() => setEditingReward(null)}
                title="Editar recompensa"
            >
                <RewardForm
                    initial={editingReward}
                    onSubmit={async (data) => {
                        if (editingReward) {
                            await updateMutation.mutateAsync({ id: editingReward.id, data });
                        }
                    }}
                    onCancel={() => setEditingReward(null)}
                    loading={updateMutation.isPending}
                />
            </Modal>

            {/* Confirmar canjear */}
            <ConfirmDialog
                isOpen={!!redeemingReward}
                onClose={() => setRedeemingReward(null)}
                onConfirm={() => { if (redeemingReward) redeemMutation.mutate(redeemingReward.id); }}
                title="Canjear recompensa"
                message={`¿Confirmas canjear "${redeemingReward?.name}" por ${redeemingReward?.points_cost.toLocaleString()} puntos? Tu balance quedará en ${(currentBalance - (redeemingReward?.points_cost ?? 0)).toLocaleString()} pts.`}
                loading={redeemMutation.isPending}
            />

            {/* Confirmar eliminar */}
            <ConfirmDialog
                isOpen={!!deletingReward}
                onClose={() => setDeletingReward(null)}
                onConfirm={() => { if (deletingReward) deleteMutation.mutate(deletingReward.id); }}
                title="Eliminar recompensa"
                message={`¿Seguro que quieres eliminar "${deletingReward?.name}"?`}
                loading={deleteMutation.isPending}
            />
        </div>
    );
}