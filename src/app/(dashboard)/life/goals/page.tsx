'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { goalService } from '@/lib/services/goalService';
import { Goal } from '@/types';
import Modal from '@/components/ui/Modal';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import GoalForm from '@/components/life/GoalForm';
import GoalCard from '@/components/life/GoalCard';
import { Target } from 'lucide-react';
import LoadingCards from '@/components/ui/LoadingCards';

export default function GoalsPage() {
    const queryClient = useQueryClient();
    const router = useRouter();

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [deletingGoal, setDeletingGoal] = useState<Goal | null>(null);

    const { data: goals = [], isLoading } = useQuery({
        queryKey: ['goals'],
        queryFn: goalService.getAll,
    });

    const createMutation = useMutation({
        mutationFn: goalService.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['goals'] });
            setIsCreateOpen(false);
        },
    });

    const deleteMutation = useMutation({
        mutationFn: goalService.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['goals'] });
            setDeletingGoal(null);
        },
    });

    const activeGoals = goals.filter(g => g.status === 'active');
    const completedGoals = goals.filter(g => g.status !== 'active');

    return (
        <div className="max-w-4xl mx-auto pt-10 md:pt-0">
            {/* <LifeStats />    */}

            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white ">Mis Metas</h1>
                    <p className="text-white/50 text-sm mt-1">
                        {activeGoals.length} meta{activeGoals.length !== 1 ? 's' : ''} activa{activeGoals.length !== 1 ? 's' : ''}
                    </p>
                </div>
                <button
                    onClick={() => setIsCreateOpen(true)}
                    className="bg-[#463671] text-[#CBD5E1] text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
                >
                    + Nueva meta
                </button>
            </div>

            {/* Lista */}
            {isLoading ? (
                <LoadingCards />
            ) : goals.length === 0 ? (
                <div className="text-center py-20 border-2 border-dashed border-gray-100 rounded-xl">
                    <Target className="text-4xl mb-3" />
                    <p className="text-gray-500 text-sm">No tienes metas aún.</p>
                    <button
                        onClick={() => setIsCreateOpen(true)}
                        className="mt-4 text-blue-600 text-sm hover:underline"
                    >
                        Crea tu primera meta
                    </button>
                </div>
            ) : (
                <div className="space-y-8">
                    {/* Metas activas */}
                    {activeGoals.length > 0 && (
                        <div>
                            <h2 className="text-sm font-semibold text-[#CBD5E1] uppercase tracking-wider mb-4">
                                Activas
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 ">
                                {activeGoals.map((goal) => (
                                    <GoalCard
                                        key={goal.id}
                                        goal={goal}
                                        onOpen={() => router.push(`/life/goals/${goal.id}`)}
                                        onDelete={(e) => {
                                            e.stopPropagation();
                                            setDeletingGoal(goal);
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Metas completadas/fallidas */}
                    {completedGoals.length > 0 && (
                        <div>
                            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                                Historial
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {completedGoals.map((goal) => (
                                    <GoalCard
                                        key={goal.id}
                                        goal={goal}
                                        onOpen={() => router.push(`/life/goals/${goal.id}`)}
                                        onDelete={(e) => {
                                            e.stopPropagation();
                                            setDeletingGoal(goal);
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Modal Crear */}
            <Modal
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
                title="Nueva meta"
            >
                <GoalForm
                    onSubmit={async (data) => { await createMutation.mutateAsync(data); }}
                    onCancel={() => setIsCreateOpen(false)}
                    loading={createMutation.isPending}
                />
            </Modal>

            {/* Confirmar eliminar */}
            <ConfirmDialog
                isOpen={!!deletingGoal}
                onClose={() => setDeletingGoal(null)}
                onConfirm={() => { if (deletingGoal) deleteMutation.mutate(deletingGoal.id); }}
                title="Eliminar meta"
                message={`¿Seguro que quieres eliminar "${deletingGoal?.title}"? Se eliminarán todas sus tareas y registros.`}
                loading={deleteMutation.isPending}
            />
        </div>
    );
}