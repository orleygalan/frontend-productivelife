'use client';

import { useState, useEffect } from 'react';
import { Task } from '@/types';

interface TaskFormProps {
    initial?: Task | null;
    onSubmit: (data: {
        title: string;
        description?: string;
        due_date?: string;
    }) => Promise<void>;
    onCancel: () => void;
    loading?: boolean;
}

export default function TaskForm({
    initial,
    onSubmit,
    onCancel,
    loading,
}: TaskFormProps) {
    const [form, setForm] = useState({
        title: '',
        description: '',
        due_date: '',
    });

    useEffect(() => {
        if (initial) {
            setForm({
                title: initial.title,
                description: initial.description ?? '',
                due_date: initial.due_date ?? '',
            });
        }
    }, [initial]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSubmit({
            title: form.title,
            description: form.description || undefined,
            due_date: form.due_date || undefined,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Título <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    required
                    placeholder="Título de la tarea"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descripción
                </label>
                <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Descripción opcional"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha límite
                </label>
                <input
                    type="date"
                    name="due_date"
                    value={form.due_date}
                    onChange={handleChange}
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
                    {loading ? 'Guardando...' : initial ? 'Guardar cambios' : 'Crear tarea'}
                </button>
            </div>
        </form>
    );
}