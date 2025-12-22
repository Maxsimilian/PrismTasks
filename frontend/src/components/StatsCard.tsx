import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
    label: string;
    value: string | number;
    icon: LucideIcon;
    trend?: string;
    className?: string;
}

export function StatsCard({ label, value, icon: Icon, trend, className }: StatsCardProps) {
    return (
        <div className={cn("rounded-xl border bg-white p-6 shadow-sm dark:bg-gray-800 dark:border-gray-700", className)}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
                    <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
                </div>
                <div className="rounded-full bg-blue-50 p-3 dark:bg-blue-900/20">
                    <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
            </div>
            {trend && (
                <div className="mt-4 flex items-center text-sm">
                    <span className="text-green-600 font-medium">{trend}</span>
                    <span className="ml-2 text-gray-500 dark:text-gray-400">vs last week</span>
                </div>
            )}
        </div>
    );
}
