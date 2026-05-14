'use client';

import { Task, TaskStatus } from '@/types';
import { Calendar, Pencil, Trash2 } from 'lucide-react';

interface KanbanColumnProps {
    title: string;
    status: TaskStatus;
    tasks: Task[];
    color: string;
    onEdit: (task: Task) => void;
    onDelete: (task: Task) => void;
    onChangeStatus: (task: Task, status: TaskStatus) => void;
}

const statusOptions: { value: TaskStatus; label: string }[] = [
    { value: 'todo', label: 'Por hacer' },
    { value: 'in_progress', label: 'En progreso' },
    { value: 'done', label: 'Hecho' },
];

export default function KanbanColumn({
    title,
    status,
    tasks,
    color,
    onEdit,
    onDelete,
    onChangeStatus,
}: KanbanColumnProps) {
    return (
        <div className="flex-1 min-w-0">
            {/* Header columna */}
            <div className={`flex items-center gap-2 mb-4 px-1`}>
                <span className={`w-2.5 h-2.5 rounded-full ${color}`} />
                <h3 className="font-semibold text-gray-700 text-sm">{title}</h3>
                <span className="ml-auto bg-gray-100 text-gray-500 text-xs font-medium px-2 py-0.5 rounded-full">
                    {tasks.length}
                </span>
            </div>

            {/* Tarjetas */}
            <div className="space-y-3 min-h-24">
                {tasks.length === 0 ? (
                    <div className="border-2 border-dashed border-gray-100 rounded-xl p-6 text-center">
                        <p className="text-xs text-gray-300">Sin tareas</p>
                    </div>
                ) : (
                    tasks.map((task) => (
                        <div
                            key={task.id}
                            className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-sm transition-shadow"
                        >
                            <div className="flex items-start justify-between gap-2">
                                <p className="text-sm font-medium text-gray-800 leading-snug">
                                    {task.title}
                                </p>
                                <div className="flex gap-1 shrink-0">
                                    <button
                                        onClick={() => onEdit(task)}
                                        className="text-gray-300 hover:text-blue-500 transition-colors text-xs"
                                    >
                                         <Pencil size={18} />
                                    </button>
                                    <button
                                        onClick={() => onDelete(task)}
                                        className="text-gray-300 hover:text-red-400 transition-colors text-xs"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>

                            {task.description && (
                                <p className="text-xs text-gray-400 mt-1.5 line-clamp-2">
                                    {task.description}
                                </p>
                            )}

                            {task.due_date && (
                                <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                                    <Calendar size={14} /> {new Date(task.due_date).toLocaleDateString('es-CO')}
                                </p>
                            )}

                            {/* Mover a otra columna */}
                            <div className="mt-3 pt-3 border-t border-gray-50">
                                <select
                                    value={task.status}
                                    onChange={(e) =>
                                        onChangeStatus(task, e.target.value as TaskStatus)
                                    }
                                    className="w-full text-xs px-2 py-1.5 rounded-lg border border-gray-100 bg-gray-50 text-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-400"
                                >
                                    {statusOptions.map((opt) => (
                                        <option key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}