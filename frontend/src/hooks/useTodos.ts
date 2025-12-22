import { useState, useCallback } from 'react';
import { Todo, CreateTodoRequest, UpdateTodoRequest } from '@/types';
import { todoApi } from '@/lib/api';
import { useToast } from './useToast';
import { getErrorMessage } from '@/lib/errorMapper';

export function useTodos() {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { success, error: toastError } = useToast();

    const fetchTodos = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await todoApi.getAll();
            setTodos(data);
            return data;
        } catch (err) {
            setError(getErrorMessage(err));
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const addTodo = async (data: CreateTodoRequest) => {
        try {
            await todoApi.create(data);
            success("Task created");
            await fetchTodos();
            return true;
        } catch (err) {
            toastError(getErrorMessage(err));
            return false;
        }
    };

    const updateTodo = async (id: number, data: UpdateTodoRequest) => {
        const originalTodos = [...todos];
        // Optimistic update
        setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, ...data } : t)));

        try {
            await todoApi.update(id, data);
            success("Task updated");
            // Background re-fetch to ensure consistency
            fetchTodos();
            return true;
        } catch (err) {
            // Rollback
            setTodos(originalTodos);
            toastError(getErrorMessage(err));
            return false;
        }
    };

    const deleteTodo = async (id: number) => {
        try {
            await todoApi.delete(id);
            success("Task deleted");
            setTodos((prev) => prev.filter((t) => t.id !== id));
            return true;
        } catch (err) {
            toastError(getErrorMessage(err));
            return false;
        }
    };

    const toggleComplete = async (todo: Todo) => {
        // Optimistic update
        const originalTodos = [...todos];
        setTodos(prev => prev.map(t => t.id === todo.id ? { ...t, complete: !t.complete } : t));

        try {
            await todoApi.update(todo.id, { ...todo, complete: !todo.complete });
            // No success toast for simple toggle to reduce noise
        } catch (err) {
            // Revert
            setTodos(originalTodos);
            toastError(getErrorMessage(err));
        }
    }

    return { todos, loading, error, fetchTodos, addTodo, updateTodo, deleteTodo, toggleComplete };
}
