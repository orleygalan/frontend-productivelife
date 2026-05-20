'use client';

import { useState, use } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { teamService } from '@/lib/services/teamService';
import { organizationService } from '@/lib/services/organizationService';
import { Team, TeamMember } from '@/types';
import Modal from '@/components/ui/Modal';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import TeamForm from '@/components/work/TeamForm';
import { ArrowRight, ChevronRight, Pencil, Trash2, Users } from 'lucide-react';
import AddMemberForm from '@/components/work/AddMemberForm';
import LoadingCards from '@/components/ui/LoadingCards';

const roleColors: Record<string, string> = {
    admin: 'bg-purple-100 text-purple-700',
    editor: 'bg-blue-100 text-blue-700',
    viewer: 'bg-gray-100 text-gray-600',
};

const roleLabels: Record<string, string> = {
    admin: 'Admin',
    editor: 'Editor',
    viewer: 'Viewer',
};

export default function TeamsPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id: organizationId } = use(params);
    const router = useRouter();
    const queryClient = useQueryClient();

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingTeam, setEditingTeam] = useState<Team | null>(null);
    const [deletingTeam, setDeletingTeam] = useState<Team | null>(null);
    const [managingTeam, setManagingTeam] = useState<Team | null>(null);
    const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
    const [removingMember, setRemovingMember] = useState<{ member: TeamMember; teamId: string } | null>(null);

    // Obtener la organización para mostrar su nombre
    const { data: organization } = useQuery({
        queryKey: ['organization', organizationId],
        queryFn: () => organizationService.getOne(organizationId),
    });

    // Obtener equipos
    const { data: teams = [], isLoading } = useQuery({
        queryKey: ['teams', organizationId],
        queryFn: () => teamService.getAll(organizationId),
    });
    //  Obtener detalle del equipo que se esta gestionando / con miembros
    const { data: teamDetail } = useQuery({
        queryKey: ['team', managingTeam?.id],
        queryFn: () => teamService.getOne(managingTeam!.id),
        enabled: !!managingTeam,
    });

    // Crear
    const createMutation = useMutation({
        mutationFn: (data: { name: string }) =>
            teamService.create({ ...data, organization_id: organizationId }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['teams', organizationId] });
            setIsCreateOpen(false);
        },
    });

    // Editar
    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: { name: string } }) =>
            teamService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['teams', organizationId] });
            setEditingTeam(null);
        },
    });

    // Eliminar
    const deleteMutation = useMutation({
        mutationFn: teamService.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['teams', organizationId] });
            setDeletingTeam(null);
        },
    });

    const addMemberMutation = useMutation({
        mutationFn: (data: { email: string; role: 'admin' | 'editor' | 'viewer' }) =>
            teamService.addMember(managingTeam!.id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['team', managingTeam?.id] });
            setIsAddMemberOpen(false);
        },
    });

    const removeMemberMutation = useMutation({
        mutationFn: ({ teamId, userId }: { teamId: string; userId: string }) =>
            teamService.removeMember(teamId, userId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['team', managingTeam?.id] });
            setRemovingMember(null);
        },
    });

    const handleEdit = (e: React.MouseEvent, team: Team) => {
        e.stopPropagation();
        setDeletingTeam(null);
        setEditingTeam(team);
    };

    const handleDelete = (e: React.MouseEvent, team: Team) => {
        e.stopPropagation();
        setEditingTeam(null);
        setDeletingTeam(team);
    };

    const handleManageMembers = (e: React.MouseEvent, team: Team) => {
        e.stopPropagation();
        setManagingTeam(team);
    };

    return (
        <div className='pt-9 md:pt-0'>
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs text-gray-400 mb-6">
                <button
                    onClick={() => router.push('/work/organizations')}
                    className="hover:text-blue-600 transition-colors hidden sm:block"
                >
                    Organizaciones
                </button>
                <button className='sm:hidden'> ... </button>
                <ChevronRight size={16} />
                <span className="text-gray-700 font-medium">{organization?.name ?? '...'}</span>
                <ChevronRight size={16} />
                <span className="text-gray-700 font-medium">Equipos</span>
            </div>

            {/* Header */}
            <div className="flex items-center justify-between mb-8 pt-8 relative">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Equipos</h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Equipos de {organization?.name ?? '...'}
                    </p>
                </div>
                <button
                    onClick={() => setIsCreateOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors absolute right-0 -top-4 sm:static"
                >
                    + Nuevo equipo
                </button>
            </div>

            {/* Lista */}
            {isLoading ? (
                <LoadingCards />
            ) : teams.length === 0 ? (
                <div className="flex flex-col justify-center items-center py-20">
                    <Users className="text-4xl mb-3" />
                    <p className="text-gray-500 text-sm">No hay equipos en esta organización.</p>
                    <button
                        onClick={() => setIsCreateOpen(true)}
                        className="mt-4 text-blue-600 text-sm hover:underline"
                    >
                        Crea tu primer equipo
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {teams.map((team) => (
                        <div
                            key={team.id}
                            className="bg-white rounded-xl border border-gray-100 p-3 hover:shadow-md hover:border-blue-100 transition-all"
                        >
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="font-semibold text-gray-900">{team.name}</h3>
                                    <button
                                        onClick={() =>
                                            router.push(`/work/organizations/${organizationId}/teams/${team.id}/projects`)
                                        }
                                        className="text-xs text-white mt-5 flex justify-center items-center gap-1 bg-blue-600 px-3 py-1.5 rounded-3xl cursor-pointer whitespace-nowrap ">
                                        Ver proyectos <ArrowRight size={13} />
                                    </button>
                                </div>
                                <div className="flex gap-4 ml-2">
                                    <button
                                        onClick={(e) => handleManageMembers(e, team)}
                                        className="text-gray-400 hover:text-purple-600 text-sm transition-colors cursor-pointer"
                                        title="Gestionar miembros"
                                    >
                                        <Users size={15} />
                                    </button>
                                    <button
                                        onClick={(e) => handleEdit(e, team)}
                                        className="text-gray-400 hover:text-blue-600 text-sm transition-colors cursor-pointer"
                                    >
                                        <Pencil size={15} />
                                    </button>
                                    <button
                                        onClick={(e) => handleDelete(e, team)}
                                        className="text-gray-400 hover:text-red-500 text-sm transition-colors cursor-pointer"
                                    >
                                        <Trash2 size={15} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            )}

            {/* Modal Crear equipo */}
            <Modal
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
                title="Nuevo equipo"
            >
                <TeamForm
                    onSubmit={async (data) => { await createMutation.mutateAsync(data); }}
                    onCancel={() => setIsCreateOpen(false)}
                    loading={createMutation.isPending}
                />
            </Modal>

            {/* Modal Editar equipo */}
            <Modal
                isOpen={!!editingTeam}
                onClose={() => setEditingTeam(null)}
                title="Editar equipo"
            >
                <TeamForm
                    initial={editingTeam}
                    onSubmit={async (data) => {
                        if (editingTeam) {
                            await updateMutation.mutateAsync({ id: editingTeam.id, data });
                        }
                    }}
                    onCancel={() => setEditingTeam(null)}
                    loading={updateMutation.isPending}
                />
            </Modal>

            {/* Modal Gestionar miembros */}
            <Modal
                isOpen={!!managingTeam}
                onClose={() => { setManagingTeam(null); setIsAddMemberOpen(false); }}
                title={`Miembros — ${managingTeam?.name}`}
            >
                <div className="space-y-4">
                    {/* Lista de miembros */}
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                        {!teamDetail?.members || teamDetail.members.length === 0 ? (
                            <p className="text-sm text-gray-400 text-center py-4">
                                No hay miembros en este equipo
                            </p>
                        ) : (
                            teamDetail.members.map((member) => (
                                <div
                                    key={member.id}
                                    className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3"
                                >
                                    <div>
                                        <p className="text-sm font-medium text-gray-800">{member.name}</p>
                                        <p className="text-xs text-gray-400">
                                            {member.email}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`... ${roleColors[member.pivot?.role ?? 'editor']}`}>
                                            {roleLabels[member.pivot?.role ?? 'editor']}
                                        </span>
                                        <button
                                            onClick={() => setRemovingMember({ member, teamId: managingTeam!.id })}
                                            className="text-gray-300 hover:text-red-400 transition-colors text-xs"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Formulario agregar miembro */}
                    {isAddMemberOpen ? (
                        <div className="border-t border-gray-100 pt-4">
                            <AddMemberForm
                                onSubmit={async (data) => { await addMemberMutation.mutateAsync(data); }}
                                onCancel={() => setIsAddMemberOpen(false)}
                                loading={addMemberMutation.isPending}
                            />
                        </div>
                    ) : (
                        <div className="border-t border-gray-100 pt-4">
                            <button
                                onClick={() => setIsAddMemberOpen(true)}
                                className="w-full py-2.5 text-sm text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors font-medium"
                            >
                                + Agregar miembro
                            </button>
                        </div>
                    )}
                </div>
            </Modal>

            {/* Confirmar eliminar equipo*/}
            <ConfirmDialog
                isOpen={!!deletingTeam}
                onClose={() => setDeletingTeam(null)}
                onConfirm={() => {
                    if (deletingTeam) deleteMutation.mutate(deletingTeam.id);
                }}
                title="Eliminar equipo"
                message={`¿Seguro que quieres eliminar "${deletingTeam?.name}"? Esta acción no se puede deshacer.`}
                loading={deleteMutation.isPending}
            />

            {/* Confirmar eliminar miembro */}
            <ConfirmDialog
                isOpen={!!removingMember}
                onClose={() => setRemovingMember(null)}
                onConfirm={() => {
                    if (removingMember) {
                        removeMemberMutation.mutate({
                            teamId: removingMember.teamId,
                            userId: removingMember.member.id,
                        });
                    }
                }}
                title="Eliminar miembro"
                message={`¿Seguro que quieres eliminar a "${removingMember?.member.name}" del equipo?`}
                loading={removeMemberMutation.isPending}
            />
        </div>
    );
}