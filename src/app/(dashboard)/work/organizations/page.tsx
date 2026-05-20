'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { organizationService } from '@/lib/services/organizationService';
import { Organization } from '@/types';
import Modal from '@/components/ui/Modal';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import OrganizationForm from '@/components/work/OrganizationForm';
import { useRouter } from 'next/navigation';
import { ArrowRight, Building2, Pencil, Trash2 } from 'lucide-react';
import LoadingCards from '@/components/ui/LoadingCards';

export default function OrganizationsPage() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingOrg, setEditingOrg] = useState<Organization | null>(null);
  const [deletingOrg, setDeletingOrg] = useState<Organization | null>(null);

  // Obtener organizaciones
  const { data: organizations = [], isLoading } = useQuery({
    queryKey: ['organizations'],
    queryFn: organizationService.getAll,
  });

  // Crear
  const createMutation = useMutation({
    mutationFn: organizationService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
      setIsCreateOpen(false);
    },
  });

  // Editar
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: { name: string; description?: string } }) =>
      organizationService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
      setEditingOrg(null);
    },
  });

  // Eliminar
  const deleteMutation = useMutation({
    mutationFn: organizationService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
      setDeletingOrg(null);
    },
  });

  // console.log(editingOrg);
  return (
    <div className='mt-10 md:mt-0'>
      {/* Header */}
      <div className="flex items-center justify-between mb-8 relative">
        <div>
          <h1 className="text-2xl font-bold text-black">Organizaciones</h1>
          <p className="text-gray-500 text-sm mt-1">
            Gestiona tus organizaciones de trabajo
          </p>
        </div>
        <button
          onClick={() => setIsCreateOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors absolute right-0 -top-10 sm:static "
        >
          + Nueva organización
        </button>
      </div>

      {/* Lista */}
      {isLoading ? (
        <LoadingCards />
      ) : organizations.length === 0 ? (
        <div className="flex flex-col justify-center items-center py-20">
          <Building2 className="text-4xl mb-3" />
          <p className="text-gray-500 text-sm">
            No tienes organizaciones aún.
          </p>
          <button
            onClick={() => setIsCreateOpen(true)}
            className="mt-4 text-blue-600 text-sm hover:underline"
          >
            Crea tu primera organización
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {organizations.map((org) => (
            <div
              key={org.id}
              className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-sm transition-shadow cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">{org.name}</h3>
                  {org.description && (
                    <p className="text-sm text-gray-400 mt-1">{org.description}</p>
                  )}
                </div>
                <div className="flex gap-2 ml-2">
                  <button
                    onClick={() => setEditingOrg(org)}
                    className="text-gray-400 hover:text-blue-600 text-sm transition-colors"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => setDeletingOrg(org)}
                    className="text-gray-400 hover:text-red-500 text-sm transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              <button
                onClick={() => router.push(`/work/organizations/${org.id}/teams`)}
                className="text-xs text-white mt-3 flex justify-center items-center gap-1 bg-blue-600 px-3 py-1.5 rounded-3xl cursor-pointer whitespace-nowrap ">
                Ver Equipos <ArrowRight size={13} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Modal Crear */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Nueva organización"
      >
        <OrganizationForm
          onSubmit={async (data) => { await createMutation.mutateAsync(data); }}
          onCancel={() => setIsCreateOpen(false)}
          loading={createMutation.isPending}
        />
      </Modal>

      {/* Modal Editar */}
      <Modal
        isOpen={!!editingOrg}
        onClose={() => setEditingOrg(null)}
        title="Editar organización"
      >
        <OrganizationForm
          initial={editingOrg ?? undefined}
          onSubmit={async (data) => {
            if (editingOrg) {
              await updateMutation.mutateAsync({ id: editingOrg.id, data });
            }
          }}
          onCancel={() => setEditingOrg(null)}
          loading={updateMutation.isPending}
        />
      </Modal>

      {/* Confirmar eliminar */}
      <ConfirmDialog
        isOpen={!!deletingOrg}
        onClose={() => setDeletingOrg(null)}
        onConfirm={() => {
          if (deletingOrg) deleteMutation.mutate(deletingOrg.id);
        }}
        title="Eliminar organización"
        message={`¿Seguro que quieres eliminar "${deletingOrg?.name}"? Esta acción no se puede deshacer.`}
        loading={deleteMutation.isPending}
      />
    </div>
  );
}