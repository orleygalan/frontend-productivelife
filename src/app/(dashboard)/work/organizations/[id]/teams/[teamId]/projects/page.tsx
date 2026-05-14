"use client";

import ConfirmDialog from "@/components/ui/ConfirmDialog";
import Modal from "@/components/ui/Modal";
import ProjectForm from "@/components/work/ProjectForm";
import { organizationService } from "@/lib/services/organizationService";
import { projectService } from "@/lib/services/projectService";
import { teamService } from "@/lib/services/teamService";
import { Project } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowRight, ChevronRight, Folder, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { use, useState } from "react";

const statusLabel: Record<string, { label: string; color: string }> = {
    active: { label: 'Activo', color: 'bg-green-100 text-green-700' },
    completed: { label: 'Completado', color: 'bg-blue-100 text-blue-700' },
    archived: { label: 'Archivado', color: 'bg-gray-100 text-gray-500' },
};

export default function ProjectsPage({
    params,
}: {
    params: Promise<{ id: string; teamId: string }>;
}) {

    const { id: organizationId, teamId } = use(params);
    const router = useRouter();
    const queryClient = useQueryClient();

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | null>(null);
    const [deletingProject, setDeletingProject] = useState<Project | null>(null);

    const { data: organization } = useQuery({
        queryKey: ['organization', organizationId],
        queryFn: () => organizationService.getOne(organizationId),
    });

    const { data: team } = useQuery({
        queryKey: ['team', teamId],
        queryFn: () => teamService.getOne(teamId),
    });

    const { data: projects = [], isLoading } = useQuery({
        queryKey: ['projects', teamId],
        queryFn: () => projectService.getByTeam(teamId),
    });

    const createMutation = useMutation({
        mutationFn: (data: { name: string; description?: string }) =>
            projectService.create({ ...data, team_id: teamId }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects', teamId] });
            setIsCreateOpen(false);
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: { name: string; description?: string } }) =>
            projectService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects', teamId] });
            setEditingProject(null);
        },
    });

    const deleteMutation = useMutation({
        mutationFn: projectService.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects', teamId] });
            setDeletingProject(null);
        },
    });

    const handleEdit = (e: React.MouseEvent, project: Project) => {
        e.stopPropagation();
        setDeletingProject(null);
        setEditingProject(project);
    };

    const handleDelete = (e: React.MouseEvent, project: Project) => {
        e.stopPropagation();
        setEditingProject(null);
        setDeletingProject(project);
    };

    return (
        <div>
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
                <span className="text-gray-700 font-medium">{team?.name ?? '...'}</span>
                <ChevronRight size={16} />
                <span className="text-gray-700 font-medium">Proyectos</span>
            </div>

            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Proyectos</h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Proyectos del equipo {team?.name ?? '...'}
                    </p>
                </div>
                <button
                    onClick={() => setIsCreateOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
                >
                    + Nuevo proyecto
                </button>
            </div>

            {/* Lista */}
            {isLoading ? (
                <div className="text-gray-400 text-sm">Cargando...</div>
            ) : projects.length === 0 ? (
                <div className="text-center py-20">
                    <Folder className="text-4xl text-amber-600 mb-3" />
                    <p className="text-gray-500 text-sm">No hay proyectos en este equipo.</p>
                    <button
                        onClick={() => setIsCreateOpen(true)}
                        className="mt-4 text-blue-600 text-sm hover:underline"
                    >
                        Crea tu primer proyecto
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {projects.map((project) => (
                        <div
                            key={project.id}
                            onClick={() =>
                                router.push(
                                    `/work/organizations/${organizationId}/teams/${teamId}/projects/${project.id}/tasks`
                                )
                            }
                            className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md hover:border-blue-100 transition-all cursor-pointer"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-gray-900 truncate">{project.name}</h3>
                                    {project.description && (
                                        <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                                            {project.description}
                                        </p>
                                    )}
                                    <span className={`inline-block mt-2 text-xs px-2 py-0.5 rounded-full font-medium ${statusLabel[project.status]?.color}`}>
                                        {statusLabel[project.status]?.label}
                                    </span>
                                </div>
                                <div className="flex gap-2 ml-2">
                                    <button
                                        onClick={(e) => handleEdit(e, project)}
                                        className="text-gray-400 hover:text-blue-600 text-sm transition-colors"
                                    >
                                        <Pencil size={18} />
                                    </button>
                                    <button
                                        onClick={(e) => handleDelete(e, project)}
                                        className="text-gray-400 hover:text-red-500 text-sm transition-colors"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                            <p className="text-xs text-gray-400 mt-3 flex justify-start items-center gap-1">
                                Ver tareas <ArrowRight size={13} />
                            </p>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal Crear */}
            <Modal
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
                title="Nuevo proyecto"
            >
                <ProjectForm
                    onSubmit={async (data) => { await createMutation.mutateAsync(data); }}
                    onCancel={() => setIsCreateOpen(false)}
                    loading={createMutation.isPending}
                />
            </Modal>

            {/* Modal Editar */}
            <Modal
                isOpen={!!editingProject}
                onClose={() => setEditingProject(null)}
                title="Editar proyecto"
            >
                <ProjectForm
                    initial={editingProject}
                    onSubmit={async (data) => {
                        if (editingProject) {
                            await updateMutation.mutateAsync({ id: editingProject.id, data });
                        }
                    }}
                    onCancel={() => setEditingProject(null)}
                    loading={updateMutation.isPending}
                />
            </Modal>

            {/* Confirmar eliminar */}
            <ConfirmDialog
                isOpen={!!deletingProject}
                onClose={() => setDeletingProject(null)}
                onConfirm={() => {
                    if (deletingProject) deleteMutation.mutate(deletingProject.id);
                }}
                title="Eliminar proyecto"
                message={`¿Seguro que quieres eliminar "${deletingProject?.name}"? Esta acción no se puede deshacer.`}
                loading={deleteMutation.isPending}
            />
        </div>
    );
}