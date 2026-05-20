import { TodayTask } from "@/types";
import { Check, Pencil, Star, Trash2 } from "lucide-react";

export default function TaskCard({
    task,
    goalStatus,
    onComplete,
    onUncomplete,
    onEdit,
    onDelete,
}: {
    task: TodayTask;
    goalStatus: string;
    onComplete: () => void;
    onUncomplete: () => void;
    onEdit: () => void;
    onDelete: () => void;
}) {
    return (
        <div className={`rounded-xl p-4 transition-all ${task.completed ? 'bg-[#463671]' : 'bg-[#463671]/30 '
            }`}>
            <div className="flex items-center gap-3">
                {/* Checkbox */}
                <button
                    onClick={task.completed ? onUncomplete : onComplete}
                    disabled={goalStatus !== 'active'}
                    className={`w-7 h-7 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors hover:cursor-pointer ${task.completed
                        ? 'bg-green-500 border-green-500 text-white'
                        : 'border-gray-300 hover:border-green-400'
                        }`}
                >
                    {task.completed && <Check className="text-xs font-bold" />}
                </button>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${task.completed ? 'line-through text-[#CBD5E1]/50' : 'text-[#CBD5E1]'
                        }`}>
                        {task.title}
                    </p>
                    <p className="text-xs text-purple-200 mt-0.5 flex gap-2"> <Star size={15} /> {task.xp_per_day} XP</p>
                </div>

                {/* Acciones - solo si es editable */}
                {task.is_editable && !task.completed && goalStatus === 'active' && (
                    <div className="flex gap-3">
                        <button
                            onClick={onEdit}
                            className="text-gray-300 hover:text-blue-500 text-xs transition-colors"
                        >
                            <Pencil size={15} />
                        </button>
                        <button
                            onClick={onDelete}
                            className="text-gray-300 hover:text-red-400 text-xs transition-colors"
                        >
                            <Trash2 size={15} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}