import { Project } from "@/types";
import { useEffect, useState } from "react";

interface ProjectFormProps {
    initial?: Project | null;
    onSubmit: (data: { name: string; description?: string }) => Promise<void>;
    onCancel: () => void;
    loading?: boolean;
}

export default function ProjectForm({ initial, onSubmit, onCancel, loading }: ProjectFormProps) {
    const [form, setForm] = useState({
        name: '',
        description: '',
    });

    useEffect(() => {
        if (initial) {
            setForm({
                name: initial.name,
                description: initial.description ?? ''
            });
        }
    }, [initial])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSubmit({
            name: form.name,
            description: form.description || undefined,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    placeholder="Nombre del proyecto"
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
                    {loading ? 'Guardando...' : initial ? 'Guardar cambios' : 'Crear proyecto'}
                </button>
            </div>
        </form>
    )

}