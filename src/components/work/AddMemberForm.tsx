'use client';

import { useState } from 'react';

type Role = 'admin' | 'editor' | 'viewer';

interface AddMemberFormProps {
    onSubmit: (data: { email: string; role: Role }) => Promise<void>;
    onCancel: () => void;
    loading?: boolean;
}

const roles: { value: Role; label: string; description: string }[] = [
    { value: 'admin', label: '👑 Admin', description: 'Puede gestionar el equipo y sus miembros' },
    { value: 'editor', label: '✏️ Editor', description: 'Puede crear y editar proyectos y tareas' },
    { value: 'viewer', label: '👁️ Viewer', description: 'Solo puede ver el contenido' },
];

export default function AddMemberForm({
    onSubmit,
    onCancel,
    loading,
}: AddMemberFormProps) {
    const [email, setEmail] = useState('');
    const [role, setRole] = useState<Role>('editor');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            await onSubmit({ email, role });
            setEmail('');
            setRole('editor');
        } catch (err: any) {
            setError(
                err.response?.data?.message ||
                err.response?.data?.errors?.email?.[0] ||
                'Error al agregar el miembro.'
            );
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email del usuario <span className="text-red-500">*</span>
                </label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="usuario@email.com"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rol <span className="text-red-500">*</span>
                </label>
                <div className="space-y-2">
                    {roles.map((r) => (
                        <label
                            key={r.value}
                            className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${role === r.value
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                        >
                            <input
                                type="radio"
                                name="role"
                                value={r.value}
                                checked={role === r.value}
                                onChange={() => setRole(r.value)}
                                className="mt-0.5"
                            />
                            <div>
                                <p className="text-sm font-medium text-gray-800">{r.label}</p>
                                <p className="text-xs text-gray-400">{r.description}</p>
                            </div>
                        </label>
                    ))}
                </div>
            </div>

            {error && (
                <p className="text-sm text-red-500 bg-red-50 px-4 py-2 rounded-lg">
                    {error}
                </p>
            )}

            <div className="flex gap-3 justify-end pt-2">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 text-sm rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                    {loading ? 'Agregando...' : 'Agregar miembro'}
                </button>
            </div>
        </form>
    );
}