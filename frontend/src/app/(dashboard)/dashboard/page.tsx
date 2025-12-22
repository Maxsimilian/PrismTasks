'use client';

import { useState, useMemo, useEffect, useRef } from 'react';

import { useTodos } from "@/hooks/useTodos";
import { useAuth } from "@/hooks/useAuth";
import { TodoCard } from "@/components/TodoCard";
import { TodoForm } from "@/components/TodoForm";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { EmptyState, QuickAction } from "@/components/EmptyState";
import { ErrorState } from "@/components/ErrorState";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { Modal } from "@/components/ui/Modal";
import { StatsCard } from "@/components/StatsCard";
import { Plus, Search, ArrowUpDown, Layout, CheckCircle2, Circle, Clock } from "lucide-react";
import { Todo, CreateTodoRequest } from "@/types";
import { useDebounce } from "@/hooks/useDebounce";
import { cn } from "@/lib/utils";

type FilterType = 'all' | 'active' | 'completed';
type SortType = 'newest' | 'priority';

export default function DashboardPage() {
    const { user, loading: authLoading } = useAuth();
    const { todos, loading, error, fetchTodos, addTodo, updateTodo, deleteTodo, toggleComplete } = useTodos();
    const hasFetchedRef = useRef(false);

    // Initial fetch once session is hydrated
    useEffect(() => {
        if (!authLoading && user && !hasFetchedRef.current) {
            hasFetchedRef.current = true;
            fetchTodos();
        }
    }, [authLoading, user, fetchTodos]);

    // UI State
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState<FilterType>('all');
    const [sortBy, setSortBy] = useState<SortType>('priority');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
    const [deletingTodoId, setDeletingTodoId] = useState<number | null>(null);

    const debouncedSearch = useDebounce(searchQuery, 300);

    // Derived State
    const stats = useMemo(() => {
        const total = todos.length;
        const completed = todos.filter(t => t.complete).length;
        const pending = total - completed;
        const completionRate = total === 0 ? 0 : Math.round((completed / total) * 100);
        return { total, completed, pending, completionRate };
    }, [todos]);

    const filteredTodos = useMemo(() => {
        let result = todos;

        // Filter
        if (filter === 'active') result = result.filter(t => !t.complete);
        if (filter === 'completed') result = result.filter(t => t.complete);

        // Search
        if (debouncedSearch) {
            const q = debouncedSearch.toLowerCase();
            result = result.filter(t =>
                t.title.toLowerCase().includes(q) ||
                t.description.toLowerCase().includes(q)
            );
        }

        // Sort
        return [...result].sort((a, b) => {
            if (sortBy === 'priority') return b.priority - a.priority; // Descending priority
            return b.id - a.id; // Newest first (assuming ID increments)
        });
    }, [todos, filter, debouncedSearch, sortBy]);

    // Handlers
    const handleQuickAdd = async (title: string, priority: number) => {
        const req: CreateTodoRequest = {
            title,
            description: "Quick task added from dashboard",
            priority,
            complete: false
        };
        await addTodo(req);
    };

    const quickActions: QuickAction[] = [
        { label: "Plan tomorrow (P3)", onClick: () => handleQuickAdd("Plan tomorrow's agenda", 3) },
        { label: "Deep Work (P4)", onClick: () => handleQuickAdd("30 mins Deep Work", 4) },
        { label: "Inbox Sweep (P2)", onClick: () => handleQuickAdd("Clear email inbox", 2) },
    ];

    if (error && !loading && todos.length === 0) {
        return (
            <div className="max-w-5xl mx-auto px-4 py-12">
                <ErrorState message={error} onRetry={fetchTodos} />
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-4 py-8 pb-24 space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Today</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Make progress. Ship small wins.</p>
                </div>
                <div className="hidden md:block">
                    <Button onClick={() => setIsCreateModalOpen(true)} className="rounded-full shadow-lg shadow-blue-600/20">
                        <Plus className="h-5 w-5 mr-2" />
                        New Task
                    </Button>
                </div>
            </div>

            {/* Progress Module */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white shadow-xl shadow-blue-900/10 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <CheckCircle2 className="h-32 w-32 -mr-8 -mt-8" />
                </div>
                <div className="relative z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-4">
                    <div>
                        <h2 className="text-lg font-semibold flex items-center gap-2">
                            <Layout className="h-5 w-5 opacity-80" />
                            Your Momentum
                        </h2>
                        <p className="text-blue-100 text-sm mt-1">
                            {stats.pending === 0 && stats.total > 0
                                ? "All tasks completed! Great job!"
                                : `You have ${stats.pending} tasks remaining.`}
                        </p>
                    </div>
                    <div className="text-right">
                        <div className="text-4xl font-bold tracking-tight">{stats.completionRate}%</div>
                        <div className="text-xs text-blue-200 uppercase font-medium tracking-wider">Completion</div>
                    </div>
                </div>
                <div className="h-2.5 bg-black/20 rounded-full overflow-hidden backdrop-blur-sm">
                    <div
                        className="h-full bg-white/90 shadow-[0_0_10px_rgba(255,255,255,0.5)] rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${stats.completionRate}%` }}
                    />
                </div>
            </div>

            {/* Insights Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatsCard icon={Layout} label="Total Tasks" value={stats.total} />
                <StatsCard icon={CheckCircle2} label="Completed" value={stats.completed} />
                <StatsCard icon={Circle} label="Pending" value={stats.pending} />
                <StatsCard icon={Clock} label="Rate" value={`${stats.completionRate}%`} />
            </div>

            {/* Controls Row */}
            <div className="flex flex-col md:flex-row gap-4 items-center bg-white dark:bg-gray-800 p-2 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm sticky top-20 z-30 transition-all">
                <div className="relative w-full md:w-auto md:flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search tasks..."
                        className="w-full pl-10 pr-4 py-2 bg-transparent border-none focus:ring-0 text-sm text-gray-900 dark:text-white placeholder-gray-500"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="h-8 w-px bg-gray-200 dark:bg-gray-700 hidden md:block" />

                <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 px-2 md:px-0">
                    <div className="flex p-1 bg-gray-100 dark:bg-gray-700/50 rounded-xl">
                        {(['all', 'active', 'completed'] as FilterType[]).map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={cn(
                                    "px-4 py-1.5 rounded-lg text-sm font-medium transition-all capitalize",
                                    filter === f
                                        ? "bg-white dark:bg-gray-800 text-blue-600 shadow-sm"
                                        : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                )}
                            >
                                {f}
                            </button>
                        ))}
                    </div>

                    <div className="relative">
                        <select
                            className="appearance-none bg-gray-100 dark:bg-gray-700/50 border-none rounded-xl py-2 pl-4 pr-10 text-sm font-medium focus:ring-2 focus:ring-blue-500 cursor-pointer"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as SortType)}
                        >
                            <option value="priority">Priority First</option>
                            <option value="newest">Newest First</option>
                        </select>
                        <ArrowUpDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-500 pointer-events-none" />
                    </div>
                </div>
            </div>

            {/* Task List */}
            <div className="space-y-4 min-h-[300px]">
                {loading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                        <Skeleton key={i} className="h-32 w-full rounded-xl" />
                    ))
                ) : filteredTodos.length > 0 ? (
                    <div className="grid gap-4">
                        {filteredTodos.map((todo) => (
                            <TodoCard
                                key={todo.id}
                                todo={todo}
                                onToggle={toggleComplete}
                                onEdit={setEditingTodo}
                                onDelete={setDeletingTodoId}
                            />
                        ))}
                    </div>
                ) : (
                    <EmptyState
                        title={filter === 'all' && !searchQuery ? "No tasks yet — let's create momentum." : "No matching tasks found"}
                        description={filter === 'all' && !searchQuery ? "Start with a small win. Add one of these starter tasks:" : "Try adjusting your filters or search query."}
                        actionLabel={filter === 'all' && !searchQuery ? "Create Custom Task" : "Clear Filters"}
                        onAction={filter === 'all' && !searchQuery ? () => setIsCreateModalOpen(true) : () => { setFilter('all'); setSearchQuery(''); }}
                        quickActions={filter === 'all' && !searchQuery ? quickActions : undefined}
                    />
                )}
            </div>

            {/* Fab (Mobile) */}
            <button
                onClick={() => setIsCreateModalOpen(true)}
                className="md:hidden fixed bottom-6 right-6 h-14 w-14 bg-blue-600 text-white rounded-full shadow-lg shadow-blue-600/30 flex items-center justify-center z-40 hover:scale-105 active:scale-95 transition-all"
                aria-label="Create new task"
            >
                <Plus className="h-6 w-6" />
            </button>

            {/* Modals */}
            <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Create New Task">
                <TodoForm
                    onSubmit={async (data) => {
                        await addTodo(data);
                        setIsCreateModalOpen(false);
                    }}
                    onCancel={() => setIsCreateModalOpen(false)}
                    submitLabel="Create Task"
                />
            </Modal>

            <Modal isOpen={!!editingTodo} onClose={() => setEditingTodo(null)} title="Edit Task">
                {editingTodo && (
                    <TodoForm
                        defaultValues={{
                            title: editingTodo.title,
                            description: editingTodo.description,
                            priority: editingTodo.priority
                        }}
                        onSubmit={async (data) => {
                            if (editingTodo) {
                                await updateTodo(editingTodo.id, { ...data, complete: editingTodo.complete });
                                setEditingTodo(null);
                            }
                        }}
                        onCancel={() => setEditingTodo(null)}
                        submitLabel="Save Changes"
                    />
                )}
            </Modal>

            <ConfirmDialog
                isOpen={!!deletingTodoId}
                title="Delete Task"
                message="Are you sure you want to delete this task? This action cannot be undone."
                onConfirm={async () => {
                    if (deletingTodoId) {
                        await deleteTodo(deletingTodoId);
                        setDeletingTodoId(null);
                    }
                }}
                onClose={() => setDeletingTodoId(null)}
            />
        </div>
    );
}
