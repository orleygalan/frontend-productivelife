'use client';

import { useState, use } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { taskService } from '@/lib/services/taskService';
import { projectService } from '@/lib/services/projectService';
import { teamService } from '@/lib/services/teamService';
import { organizationService } from '@/lib/services/organizationService';
import { Task, TaskStatus } from '@/types';
import Modal from '@/components/ui/Modal';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import TaskForm from '@/components/work/TaskForm';
import KanbanColumn from '@/components/work/KanbanColumn';
import { ChevronRight } from 'lucide-react';

const columns: { status: TaskStatus; title: string; color: string }[] = [
    { status: 'todo', title: 'Por hacer', color: 'bg-gray-400' },
    { status: 'in_progress', title: 'En progreso', color: 'bg-yellow-400' },
    { status: 'done', title: 'Hecho', color: 'bg-green-400' },
];

export default function TasksPage({
    params,
}: {
    params: Promise<{ id: string; teamId: string; projectId: string }>;
}) {
    const { id: organizationId, teamId, projectId } = use(params);
    const router = useRouter();
    const queryClient = useQueryClient();

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [deletingTask, setDeletingTask] = useState<Task | null>(null);

    // Breadcrumb data
    const { data: organization } = useQuery({
        queryKey: ['organization', organizationId],
        queryFn: () => organizationService.getOne(organizationId),
    });

    const { data: team } = useQuery({
        queryKey: ['team', teamId],
        queryFn: () => teamService.getOne(teamId),
    });

    const { data: projects = [] } = useQuery({
        queryKey: ['projects', teamId],
        queryFn: () => projectService.getByTeam(teamId),
        staleTime: Infinity,
    });

    const project = projects.find((p) => p.id === projectId);

    // Tareas
    const { data: tasks = [], isLoading } = useQuery({
        queryKey: ['tasks', projectId],
        queryFn: () => taskService.getByProject(projectId),
    });

    // Crear
    const createMutation = useMutation({
        mutationFn: (data: { title: string; description?: string; due_date?: string }) =>
            taskService.create({ ...data, project_id: projectId }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks', projectId] });
            setIsCreateOpen(false);
        },
    });

    // Editar
    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: { title: string; description?: string; due_date?: string } }) =>
            taskService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks', projectId] });
            setEditingTask(null);
        },
    });

    // Cambiar status (Kanban)
    const changeStatusMutation = useMutation({
        mutationFn: ({ id, status }: { id: string; status: TaskStatus }) =>
            taskService.changeStatus(id, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks', projectId] });
        },
    });

    // Eliminar
    const deleteMutation = useMutation({
        mutationFn: taskService.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks', projectId] });
            setDeletingTask(null);
        },
    });

    const handleEdit = (task: Task) => {
        setDeletingTask(null);
        setEditingTask(task);
    };

    const handleDelete = (task: Task) => {
        setEditingTask(null);
        setDeletingTask(task);
    };

    const handleChangeStatus = (task: Task, status: TaskStatus) => {
        if (task.status !== status) {
            changeStatusMutation.mutate({ id: task.id, status });
        }
    };

    // Agrupar tareas por status
    const tasksByStatus = (status: TaskStatus) =>
        tasks.filter((t) => t.status === status);

    return (
        <div className="flex flex-col h-full">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
                <button
                    onClick={() => router.push('/work/organizations')}
                    className="hover:text-blue-600 transition-colors"
                >
                    Organizaciones
                </button>
                  <ChevronRight size={16} />
                <button
                    onClick={() => router.push(`/work/organizations/${organizationId}/teams`)}
                    className="hover:text-blue-600 transition-colors"
                >
                    {organization?.name ?? '...'}
                </button>
                  <ChevronRight size={16} />
                <button
                    onClick={() =>
                        router.push(`/work/organizations/${organizationId}/teams/${teamId}/projects`)
                    }
                    className="hover:text-blue-600 transition-colors"
                >
                    {team?.name ?? '...'}
                </button>
                  <ChevronRight size={16} />
                <span className="text-gray-700 font-medium">{project?.name ?? '...'}</span>
            </div>

            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">{project?.name ?? 'Tareas'}</h1>
                    <p className="text-gray-500 text-sm mt-1">Tablero de tareas</p>
                </div>
                <button
                    onClick={() => setIsCreateOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
                >
                    + Nueva tarea
                </button>
            </div>

            {/* Kanban */}
            {isLoading ? (
                <div className="text-gray-400 text-sm">Cargando...</div>
            ) : (
                <div className="flex gap-6 flex-1">
                    {columns.map((col) => (
                        <KanbanColumn
                            key={col.status}
                            title={col.title}
                            status={col.status}
                            color={col.color}
                            tasks={tasksByStatus(col.status)}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            onChangeStatus={handleChangeStatus}
                        />
                    ))}
                </div>
            )}

            {/* Modal Crear */}
            <Modal
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
                title="Nueva tarea"
            >
                <TaskForm
                    onSubmit={async (data) => { await createMutation.mutateAsync(data); }}
                    onCancel={() => setIsCreateOpen(false)}
                    loading={createMutation.isPending}
                />
            </Modal>

            {/* Modal Editar */}
            <Modal
                isOpen={!!editingTask}
                onClose={() => setEditingTask(null)}
                title="Editar tarea"
            >
                <TaskForm
                    initial={editingTask}
                    onSubmit={async (data) => {
                        if (editingTask) {
                            await updateMutation.mutateAsync({ id: editingTask.id, data });
                        }
                    }}
                    onCancel={() => setEditingTask(null)}
                    loading={updateMutation.isPending}
                />
            </Modal>

            {/* Confirmar eliminar */}
            <ConfirmDialog
                isOpen={!!deletingTask}
                onClose={() => setDeletingTask(null)}
                onConfirm={() => {
                    if (deletingTask) deleteMutation.mutate(deletingTask.id);
                }}
                title="Eliminar tarea"
                message={`¿Seguro que quieres eliminar "${deletingTask?.title}"? Esta acción no se puede deshacer.`}
                loading={deleteMutation.isPending}
            />
        </div>
    );
}