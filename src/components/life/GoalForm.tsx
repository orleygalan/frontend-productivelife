'use client';

import { useState } from 'react';
import { GoalTerm } from '@/types';
import { Star, Target, Trash2 } from 'lucide-react';
import axios from 'axios';

interface TaskInput {
    title: string;
    xp_per_day: number;
}

interface GoalFormProps {
    onSubmit: (data: {
        title: string;
        description?: string;
        start_date: string;
        end_date: string;
        tasks: TaskInput[];
    }) => Promise<void>;
    onCancel: () => void;
    loading?: boolean;
}

const xpRanges: Record<GoalTerm, { min: number; max: number; label: string }> = {
    short: { min: 100, max: 300, label: 'Corto plazo (menos de 1 año)' },
    medium: { min: 301, max: 500, label: 'Mediano plazo (1 a 5 años)' },
    long: { min: 501, max: 700, label: 'Largo plazo (más de 5 años)' },
};

function calculateTerm(startDate: string, endDate: string): GoalTerm | null {
    if (!startDate || !endDate) return null;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const months = (end.getFullYear() - start.getFullYear()) * 12
        + (end.getMonth() - start.getMonth());

    if (months < 12) return 'short';
    if (months < 60) return 'medium';
    return 'long';
}

export default function GoalForm({ onSubmit, onCancel, loading }: GoalFormProps) {
    const today = new Date().toISOString().split('T')[0];

    const [form, setForm] = useState({
        title: '',
        description: '',
        start_date: today,
        end_date: '',
    });

    const [tasks, setTasks] = useState<TaskInput[]>([
        { title: '', xp_per_day: 0 },
        { title: '', xp_per_day: 0 },
    ]);

    const [error, setError] = useState('');

    const term = calculateTerm(form.start_date, form.end_date);
    const range = term ? xpRanges[term] : null;

    const handleFormChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleTaskChange = (
        index: number,
        field: keyof TaskInput,
        value: string | number
    ) => {
        const updated = [...tasks];
        updated[index] = { ...updated[index], [field]: value };
        setTasks(updated);
    };

    const addTask = () => {
        setTasks([...tasks, { title: '', xp_per_day: range?.min ?? 100 }]);
    };

    const removeTask = (index: number) => {
        if (tasks.length <= 2) return;
        setTasks(tasks.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!term || !range) {
            setError('Selecciona una fecha límite válida.');
            return;
        }

        // Validar XP de cada tarea
        for (const task of tasks) {
            if (!task.title.trim()) {
                setError('Todas las tareas deben tener un título.');
                return;
            }
            if (task.xp_per_day < range.min || task.xp_per_day > range.max) {
                setError(`El XP de cada tarea debe estar entre ${range.min} y ${range.max} para una meta de ${range.label}.`);
                return;
            }
        }

        try {
            await onSubmit({
                title: form.title,
                description: form.description || undefined,
                start_date: form.start_date,
                end_date: form.end_date,
                tasks,
            });
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.message || 'Error al crear la meta.');
            } else {
                setError('Error inesperado al crear la tarea.');
            }

        };
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            {/* Datos de la meta */}
            <div>
                <label className="block text-sm font-medium text-purple-200 mb-1">
                    Título de la meta <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleFormChange}
                    required
                    placeholder="Ej: Aprender inglés fluido"
                    className="w-full px-4 py-2.5 rounded-lg border border-purple-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300 text-purple-200"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-purple-200 mb-1">
                    Descripción
                </label>
                <textarea
                    name="description"
                    value={form.description}
                    onChange={handleFormChange}
                    rows={2}
                    placeholder="¿Por qué quieres lograr esta meta?"
                    className="w-full px-4 py-2.5 rounded-lg border border-purple-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300 text-purple-200"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-purple-200 mb-1">
                        Fecha inicio <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="date"
                        name="start_date"
                        value={form.start_date}
                        onChange={handleFormChange}
                        required
                        className="w-full px-4 py-2.5 rounded-lg border border-purple-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300 text-purple-200"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-purple-200 mb-1">
                        Fecha límite <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="date"
                        name="end_date"
                        value={form.end_date}
                        onChange={handleFormChange}
                        required
                        min={form.start_date}
                        className="w-full px-4 py-2.5 rounded-lg border border-purple-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300 text-purple-200"
                    />
                </div>
            </div>

            {/* Badge del tipo de meta */}
            {term && range && (
                <div className={`px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-2 ${term === 'short' ? 'bg-green-50 text-green-700' :
                    term === 'medium' ? 'bg-blue-50 text-blue-700' :
                        'bg-purple-50 text-purple-700'
                    }`}>
                    <Target size={16} /> {range.label} — XP por tarea: {range.min} a {range.max} puntos
                </div>
            )}

            {/* Tareas diarias */}
            <div>
                <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-purple-200">
                        Tareas diarias <span className="text-red-500">*</span>
                        <span className="text-gray-400 font-normal ml-1">(mínimo 2)</span>
                    </label>
                    <button
                        type="button"
                        onClick={addTask}
                        className="text-xs text-blue-600 hover:underline"
                    >
                        + Agregar tarea
                    </button>
                </div>

                <div className="space-y-3">
                    {tasks.map((task, index) => (
                        <div key={index} className="flex gap-2 items-start bg-[#463671] rounded-lg p-3">
                            <div className="flex-1 space-y-2">
                                <input
                                    type="text"
                                    value={task.title}
                                    onChange={(e) => handleTaskChange(index, 'title', e.target.value)}
                                    required
                                    placeholder={`Tarea ${index + 1} — ¿Qué harás cada día?`}
                                    className="w-full px-4 py-2.5 rounded-lg border border-purple-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300 text-purple-200"
                                />
                                <div className="flex items-center gap-2">
                                    <input
                                        type="number"
                                        value={task.xp_per_day || ''}
                                        onChange={(e) => handleTaskChange(index, 'xp_per_day', Number(e.target.value))}
                                        required
                                        min={range?.min ?? 100}
                                        max={range?.max ?? 300}
                                        placeholder={range ? `${range.min} - ${range.max} XP` : 'XP por día'}
                                        className="w-32 px-4 py-2.5 rounded-lg border border-purple-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300 text-purple-200"
                                    />
                                    <span className="text-xs text-purple-100 font-medium flex items-center gap-2 ">
                                        <Star size={15} /> XP/día
                                    </span>
                                </div>
                            </div>
                            {tasks.length > 2 && (
                                <button
                                    type="button"
                                    onClick={() => removeTask(index)}
                                    className="text-gray-300 hover:text-red-400 transition-colors mt-1"
                                >
                                    <Trash2 />
                                </button>
                            )}
                        </div>
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
                    {loading ? 'Creando meta...' : 'Crear meta'}
                </button>
            </div>
        </form>
    );
}