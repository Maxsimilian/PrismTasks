import { Todo } from "@/types";
import { cn } from "@/lib/utils";
import { Check, Edit2, Trash2, Clock, AlertCircle } from "lucide-react";

interface TodoCardProps {
    todo: Todo;
    onToggle: (todo: Todo) => void;
    onEdit: (todo: Todo) => void;
    onDelete: (id: number) => void;
}

const priorityConfig: Record<number, { label: string; color: string; border: string; icon: React.ElementType }> = {
    1: { label: "Low", color: "text-slate-600 dark:text-slate-400", border: "border-l-slate-400", icon: Clock },
    2: { label: "Medium", color: "text-blue-600 dark:text-blue-400", border: "border-l-blue-500", icon: Clock },
    3: { label: "High", color: "text-yellow-600 dark:text-yellow-400", border: "border-l-yellow-500", icon: AlertCircle },
    4: { label: "Very High", color: "text-orange-600 dark:text-orange-400", border: "border-l-orange-500", icon: AlertCircle },
    5: { label: "Critical", color: "text-red-600 dark:text-red-400", border: "border-l-red-500", icon: AlertCircle },
};

export function TodoCard({ todo, onToggle, onEdit, onDelete }: TodoCardProps) {
    const config = priorityConfig[todo.priority] || priorityConfig[1];
    const PriorityIcon = config.icon;

    return (
        <div
            className={cn(
                "group relative flex items-start gap-4 rounded-xl border p-5 transition-all duration-300",
                "bg-white dark:bg-gray-800 dark:border-gray-700 hover:shadow-lg hover:-translate-y-0.5",
                todo.complete ? "opacity-60 bg-gray-50 dark:bg-gray-800/40" : "border-gray-200",
                config.border,
                "border-l-[6px]"
            )}
        >
            <button
                onClick={() => onToggle(todo)}
                className={cn(
                    "mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                    todo.complete
                        ? "border-blue-500 bg-blue-500 text-white shadow-sm scale-110"
                        : "border-gray-300 bg-transparent hover:border-blue-400 hover:shadow-inner dark:border-gray-600"
                )}
                title={todo.complete ? "Mark as incomplete" : "Mark as complete"}
            >
                <Check className={cn("h-3.5 w-3.5 transition-transform", todo.complete ? "scale-100" : "scale-0")} />
            </button>

            <div className="flex-1 min-w-0 space-y-2">
                <div>
                    <h3
                        className={cn(
                            "text-lg font-semibold text-gray-900 dark:text-gray-100 leading-tight transition-colors",
                            todo.complete && "text-gray-500 line-through dark:text-gray-500 decoration-2 decoration-gray-300"
                        )}
                    >
                        {todo.title}
                    </h3>
                    <p className={cn("text-sm text-gray-600 dark:text-gray-400 break-words mt-1", todo.complete && "text-gray-400")}>
                        {todo.description}
                    </p>
                </div>

                <div className="flex items-center gap-4 text-xs font-medium">
                    <span className={cn("flex items-center gap-1.5", config.color)}>
                        <PriorityIcon className="h-3.5 w-3.5" />
                        {config.label} Priority
                    </span>
                    {todo.complete && (
                        <span className="text-green-600 dark:text-green-400 flex items-center gap-1">
                            <Check className="h-3 w-3" /> Completed
                        </span>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200 focus-within:opacity-100 translate-x-2 group-hover:translate-x-0">
                <button
                    onClick={() => onEdit(todo)}
                    className="p-2 rounded-lg text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-colors focus:ring-2 focus:ring-blue-500"
                    title="Edit task"
                >
                    <Edit2 className="h-4 w-4" />
                </button>
                <button
                    onClick={() => onDelete(todo.id)}
                    className="p-2 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors focus:ring-2 focus:ring-red-500"
                    title="Delete task"
                >
                    <Trash2 className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}
