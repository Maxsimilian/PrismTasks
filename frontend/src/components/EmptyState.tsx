import { LucideIcon, ClipboardList, Sparkles } from 'lucide-react';
import { Button } from './ui/Button';

export interface QuickAction {
    label: string;
    onClick: () => void;
}

interface EmptyStateProps {
    icon?: LucideIcon;
    title: string;
    description: string;
    actionLabel?: string;
    onAction?: () => void;
    quickActions?: QuickAction[];
}

export function EmptyState({
    icon: Icon = ClipboardList,
    title,
    description,
    actionLabel,
    onAction,
    quickActions
}: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/20">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-full shadow-sm mb-6 ring-1 ring-gray-900/5 dark:ring-white/10">
                <Icon className="h-8 w-8 text-blue-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">{title}</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto leading-relaxed">{description}</p>

            {quickActions && quickActions.length > 0 && (
                <div className="grid sm:grid-cols-3 gap-3 w-full max-w-2xl mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
                    {quickActions.map((action, i) => (
                        <button
                            key={i}
                            onClick={action.onClick}
                            className="flex flex-col items-center justify-center p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-md transition-all group text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                            <Sparkles className="h-4 w-4 mb-2 text-gray-400 group-hover:text-blue-500 transition-colors" />
                            {action.label}
                        </button>
                    ))}
                </div>
            )}

            {actionLabel && onAction && (
                <Button onClick={onAction} variant="primary" size="lg" className="shadow-lg shadow-blue-500/20">
                    {actionLabel}
                </Button>
            )}
        </div>
    );
}
