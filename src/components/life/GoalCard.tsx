import { Goal } from "@/types";
import { ArrowRight, Flame, Trash2 } from "lucide-react";

const termConfig = {
    short: { label: 'Corto plazo', color: 'bg-green-100 text-green-700' },
    medium: { label: 'Mediano plazo', color: 'bg-blue-100 text-blue-700' },
    long: { label: 'Largo plazo', color: 'bg-purple-100 text-purple-700' },
};

const statusConfig = {
    active: { label: 'Activa', color: 'bg-green-100 text-green-700' },
    completed: { label: 'Completada', color: 'bg-blue-100 text-blue-700' },
    failed: { label: 'Fallida', color: 'bg-red-100 text-red-500' },
};

function daysLeft(endDate: string): number {
    const end = new Date(endDate);
    const today = new Date();
    const diff = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(0, diff);
}

export default function GoalCard({
    goal,
    onOpen,
    onDelete,
}: {
    goal: Goal;
    onOpen: () => void;
    onDelete: (e: React.MouseEvent) => void;
}) {
    const term = termConfig[goal.term];
    const status = statusConfig[goal.status];
    const days = daysLeft(goal.end_date);

    return (
        <div
            onClick={onOpen}
            className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md hover:border-blue-100 transition-all cursor-pointer"
        >
            <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">{goal.title}</h3>
                    {goal.description && (
                        <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{goal.description}</p>
                    )}
                </div>
                <button
                    onClick={onDelete}
                    className="text-gray-300 hover:text-red-400 transition-colors ml-2 text-sm"
                >
                    <Trash2 />
                </button>
            </div>

            {/* Badges */}
            <div className="flex items-center gap-2 mb-3 flex-wrap">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${term.color}`}>
                    {term.label}
                </span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${status.color}`}>
                    {status.label}
                </span>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-gray-50 rounded-lg py-2">
                    <p className="text-sm font-bold text-orange-500 flex flex-col items-center justify-center">
                        <Flame size={15} />
                        {goal.current_streak}</p>
                    <p className="text-xs text-gray-400">Racha</p>
                </div>
                <div className="bg-gray-50 rounded-lg py-2">
                    <p className="text-sm font-bold text-red-400">{goal.missed_days}</p>
                    <p className="text-xs text-gray-400">Fallidos</p>
                </div>
                <div className="bg-gray-50 rounded-lg py-2">
                    <p className="text-sm font-bold text-blue-600">{days}d</p>
                    <p className="text-xs text-gray-400">Restantes</p>
                </div>
            </div>

            <div className="text-xs text-gray-400 mt-3">
                <p>
                    {goal.tasks.length} tarea{goal.tasks.length !== 1 ? 's' : ''} diaria{goal.tasks.length !== 1 ? 's' : ''}
                </p>
                <button className="flex items-center gap-2 bg-[blue] text-white rounded-2xl px-3 py-1 mt-2 ">
                    Ver detalle <ArrowRight size={15} />
                </button>
            </div>
        </div>
    );
}