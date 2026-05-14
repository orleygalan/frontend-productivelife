'use client';

import { useState, useEffect } from 'react';
import { Team } from '@/types';

interface TeamFormProps {
    initial?: Team | null;
    onSubmit: (data: { name: string }) => Promise<void>;
    onCancel: () => void;
    loading?: boolean;
}

export default function TeamForm({
    initial,
    onSubmit,
    onCancel,
    loading,
}: TeamFormProps) {
    const [name, setName] = useState('');

    useEffect(() => {
        if (initial) setName(initial.name);
    }, [initial]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSubmit({ name });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre del equipo <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Nombre del equipo"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

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
                    {loading ? 'Guardando...' : initial ? 'Guardar cambios' : 'Crear equipo'}
                </button>
            </div>
        </form>
    );
}