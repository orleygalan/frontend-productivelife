'use client';

import { use, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { goalService } from '@/lib/services/goalService';
import { GoalTask } from '@/types';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import Modal from '@/components/ui/Modal';
import axios from 'axios';
import { ArrowRight, Calendar, CalendarX, ChevronRight, Flame, PartyPopper, Sparkles } from 'lucide-react';
import TaskCard from '@/components/life/TaskCard';

export default function GoalDetailPage({
    params,
}: {
    params: Promise<{ goalId: string }>;
}) {
    const { goalId } = use(params);
    const router = useRouter();
    const queryClient = useQueryClient();

    const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<GoalTask | null>(null);
    const [deletingTask, setDeletingTask] = useState<GoalTask | null>(null);
    const [newTask, setNewTask] = useState({ title: '', xp_per_day: 0 });
    const [addTaskError, setAddTaskError] = useState('');

    // Obtener tareas del día
    const { data, isLoading } = useQuery({
        queryKey: ['goal-today', goalId],
        queryFn: () => goalService.getToday(goalId),
        refetchInterval: 60000, // refresca cada minuto
    });

    const goal = data?.goal;
    const tasks = data?.tasks ?? [];
    const balance = data?.balance ?? 0;

    // Completar tarea
    const completeMutation = useMutation({
        mutationFn: (taskId: string) => goalService.completeTask(goalId, taskId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['goal-today', goalId] });
            queryClient.invalidateQueries({ queryKey: ['points-balance'] });
        },
    });

    // Descompletar tarea
    const uncompleteMutation = useMutation({
        mutationFn: (taskId: string) => goalService.uncompleteTask(goalId, taskId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['goal-today', goalId] });
            queryClient.invalidateQueries({ queryKey: ['points-balance'] });
        },
    });

    // Agregar tarea nueva
    const addTaskMutation = useMutation({
        mutationFn: (data: { title: string; xp_per_day: number }) =>
            goalService.addTask(goalId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['goal-today', goalId] });
            setIsAddTaskOpen(false);
            setNewTask({ title: '', xp_per_day: 0 });
            setAddTaskError('');
        },
        onError: (err: unknown) => {
            if (axios.isAxiosError(err)) {
                setAddTaskError(
                    err.response?.data?.message || 'Error al agregar la tarea.'
                );
            } else {
                setAddTaskError('Error inesperado al agregar la tarea.');
            }
        },
    });

    // Actualizar tarea
    const updateTaskMutation = useMutation({
        mutationFn: (data: { title: string; xp_per_day: number }) =>
            goalService.updateTask(goalId, editingTask!.id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['goal-today', goalId] });
            setEditingTask(null);
        },
    });

    // Eliminar tarea
    const deleteTaskMutation = useMutation({
        mutationFn: (taskId: string) => goalService.deleteTask(goalId, taskId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['goal-today', goalId] });
            setDeletingTask(null);
        },
    });

    const completedCount = tasks.filter(t => t.completed).length;
    const allCompleted = tasks.length > 0 && completedCount === tasks.length;

    const termColors = {
        short: 'text-[#CBD5E1] ',
        medium: 'text-[#3B6EA8] ',
        long: 'text-[#EBBAF2] ',
    };

    const termLabels = {
        short: 'Corto plazo',
        medium: 'Mediano plazo',
        long: 'Largo plazo',
    };

    if (isLoading) return <p className="text-gray-400 text-sm">Cargando...</p>;
    if (!goal) return <p className="text-gray-400 text-sm">Meta no encontrada.</p>;

    return (
        <div className="max-w-2xl mx-auto">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
                <button
                    onClick={() => router.push('/life/goals')}
                    className="hover:text-blue-600 transition-colors"
                >
                    Mis metas
                </button>
                <ChevronRight className="w-4 h-4" />
                <span className="text-gray-700 font-medium">{goal.title}</span>
            </div>

            {/* Header de la meta */}
            <div className="bg-[#080F1F] rounded-xl p-3 sm:p-6 mb-6">
                <div className="flex items-start justify-between mb-3">
                    <div>
                        <h1 className="text-xl font-bold text-[#CBD5E1] ">{goal.title}</h1>
                        {goal.description && (
                            <p className="text-sm text-gray-400 mt-1">{goal.description}</p>
                        )}
                    </div>
                    <span className={`text-sm font-semibold px-2 py-1 rounded-3xl bg-[#463671] ${termColors[goal.term]}`}>
                        {termLabels[goal.term]}
                    </span>
                </div>

                {/* Fechas */}
                <p className="text-xs text-gray-400 mb-4 flex items-center gap-2">
                    <Calendar size={15} />
                    {new Date(goal.start_date).toLocaleDateString('es-CO')}
                    <ArrowRight size={15} /> {' '}
                    {new Date(goal.end_date).toLocaleDateString('es-CO')}
                </p>

                {/* Stats de la meta */}
                <div className="grid grid-cols-3 gap-3">
                    <div className="bg-[#050A18] rounded-lg p-2 text-center">
                        <p className="text-xl font-bold text-orange-500 flex flex-col items-center">
                            <Flame size={17} />
                            {goal.current_streak}
                        </p>
                        <p className="sm:text-xs text-[11px] text-gray-400">Racha actual</p>
                    </div>
                    <div className="bg-[#050A18] rounded-lg p-2 text-center">
                        <p className="text-xl font-bold text-[#3B6EA8] flex flex-col items-center ">
                            <Sparkles size={17} />
                            {goal.max_streak}
                        </p>
                        <p className="sm:text-xs text-[11px] text-gray-400">Mejor racha</p>
                    </div>
                    <div className="bg-[#050A18] rounded-lg p-2 text-center">
                        <p className="text-xl font-bold text-red-400 flex flex-col items-center">
                            <CalendarX size={17} />
                            {goal.missed_days}
                        </p>
                        <p className="sm:text-xs text-[11px] text-gray-400">Días fallados</p>
                    </div>
                </div>
            </div>

            {/* Tareas del día */}
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h2 className="text-lg font-bold text-[#CBD5E1] ">Tareas de hoy</h2>
                    <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-2">
                        {completedCount}/{tasks.length} completadas
                        {allCompleted && <PartyPopper />}
                    </p>
                </div>
                {goal.status === 'active' && (
                    <button
                        onClick={() => setIsAddTaskOpen(true)}
                        className="text-xs text-[#CBD5E1] bg-[#463671] rounded-2xl px-2 py-1 hover:underline"
                    >
                        + Nueva tarea
                    </button>
                )}
            </div>

            {/* Banner si completó todo */}
            {allCompleted && (
                <div className="bg-[#080F1F] rounded-xl p-4 mb-4 text-center">
                    <p className="text-green-700 font-medium text-sm flex items-center gap-2">
                        <PartyPopper /> ¡Completaste todas las tareas de hoy! Tu racha sigue viva.
                    </p>
                </div>
            )}

            {/* Lista de tareas */}
            <div className="space-y-3">
                {tasks.map((task) => (
                    <TaskCard
                        key={task.id}
                        task={task}
                        goalStatus={goal.status}
                        onComplete={() => completeMutation.mutate(task.id)}
                        onUncomplete={() => uncompleteMutation.mutate(task.id)}
                        onEdit={() => {
                            const fullTask = goal.tasks.find(t => t.id === task.id);
                            if (fullTask) setEditingTask(fullTask);
                        }}
                        onDelete={() => {
                            const fullTask = goal.tasks.find(t => t.id === task.id);
                            if (fullTask) setDeletingTask(fullTask);
                        }}
                    />
                ))}
            </div>

            {/* Balance de puntos */}
            <div className="mt-6 bg-[#080F1F] rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-[#3B6EA8] ">{balance}</p>
                <p className="text-xs text-[#3B6EA8] mt-1">Puntos disponibles</p>
            </div>

            {/* Modal agregar tarea */}
            <Modal
                isOpen={isAddTaskOpen}
                onClose={() => setIsAddTaskOpen(false)}
                title="Nueva tarea diaria"
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Título <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={newTask.title}
                            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                            placeholder="¿Qué harás cada día?"
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            XP por día <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            value={newTask.xp_per_day || ''}
                            onChange={(e) => setNewTask({ ...newTask, xp_per_day: Number(e.target.value) })}
                            placeholder="XP"
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {/* Muestra el rango permitido segun el term de la meta */}
                        {goal && (
                            <p className="text-xs text-gray-400 mt-1">
                                {goal.term === 'short' && 'Rango permitido: 100 a 300 XP (Corto plazo)'}
                                {goal.term === 'medium' && 'Rango permitido: 301 a 500 XP (Mediano plazo)'}
                                {goal.term === 'long' && 'Rango permitido: 501 a 700 XP (Largo plazo)'}
                            </p>
                        )}
                    </div>
                    {/* Error del backend */}
                    {addTaskError && (
                        <p className="text-sm text-red-500 bg-red-50 px-4 py-2 rounded-lg">
                            {addTaskError}
                        </p>
                    )}
                    <div className="flex gap-3 justify-end">
                        <button
                            onClick={() => setIsAddTaskOpen(false)}
                            className="px-4 py-2 text-sm rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={() => addTaskMutation.mutate(newTask)}
                            disabled={addTaskMutation.isPending || !newTask.title || !newTask.xp_per_day}
                            className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                        >
                            {addTaskMutation.isPending ? 'Agregando...' : 'Agregar'}
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Modal editar tarea */}
            <Modal
                isOpen={!!editingTask}
                onClose={() => setEditingTask(null)}
                title="Editar tarea"
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                        <input
                            type="text"
                            value={editingTask?.title ?? ''}
                            onChange={(e) => setEditingTask(prev => prev ? { ...prev, title: e.target.value } : null)}
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">XP por día</label>
                        <input
                            type="number"
                            value={editingTask?.xp_per_day ?? ''}
                            onChange={(e) => setEditingTask(prev => prev ? { ...prev, xp_per_day: Number(e.target.value) } : null)}
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="flex gap-3 justify-end">
                        <button
                            onClick={() => setEditingTask(null)}
                            className="px-4 py-2 text-sm rounded-lg border border-gray-200 text-gray-600"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={() => {
                                if (editingTask) {
                                    updateTaskMutation.mutate({
                                        title: editingTask.title,
                                        xp_per_day: editingTask.xp_per_day,
                                    });
                                }
                            }}
                            disabled={updateTaskMutation.isPending}
                            className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                        >
                            {updateTaskMutation.isPending ? 'Guardando...' : 'Guardar'}
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Confirmar eliminar tarea */}
            <ConfirmDialog
                isOpen={!!deletingTask}
                onClose={() => setDeletingTask(null)}
                onConfirm={() => { if (deletingTask) deleteTaskMutation.mutate(deletingTask.id); }}
                title="Eliminar tarea"
                message={`¿Seguro que quieres eliminar "${deletingTask?.title}"?`}
                loading={deleteTaskMutation.isPending}
            />
        </div>
    );
}
