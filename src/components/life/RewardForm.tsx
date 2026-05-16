'use client';

import { useState, useEffect } from 'react';
import { Reward } from '@/types';
import { Lightbulb } from 'lucide-react';

interface RewardFormProps {
    initial?: Reward | null;
    onSubmit: (data: { name: string; points_cost: number }) => Promise<void>;
    onCancel: () => void;
    loading?: boolean;
}

export default function RewardForm({
    initial,
    onSubmit,
    onCancel,
    loading,
}: RewardFormProps) {
    const [form, setForm] = useState({ name: '', points_cost: 1000 });
    const [error, setError] = useState('');

    useEffect(() => {
        if (initial) {
            setForm({ name: initial.name, points_cost: initial.points_cost });
        }
    }, [initial]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            await onSubmit(form);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error al guardar la recompensa.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                    placeholder="Ej: Salir a cenar, Ver una película..."
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Costo en puntos <span className="text-red-500">*</span>
                </label>
                <input
                    type="number"
                    value={form.points_cost}
                    onChange={(e) => setForm({ ...form, points_cost: Number(e.target.value) })}
                    required
                    min={1}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <p className="text-xs text-gray-400 mt-1 flex gap-1">
                    <Lightbulb size={15} />
                     Las recompensas deben ser significativas. Ponle un costo alto para que valga la pena.
                </p>
            </div>

            {error && (
                <p className="text-sm text-red-500 bg-red-50 px-4 py-2 rounded-lg">{error}</p>
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
                    className="px-4 py-2 text-sm rounded-lg bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50 transition-colors"
                >
                    {loading ? 'Guardando...' : initial ? 'Guardar cambios' : 'Crear recompensa'}
                </button>
            </div>
        </form>
    );
}