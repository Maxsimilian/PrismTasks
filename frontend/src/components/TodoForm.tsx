import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { todoSchema } from '@/lib/validators';
import { Input } from './ui/Input';
import { Button } from './ui/Button';


type TodoFormData = z.infer<typeof todoSchema>;

interface TodoFormProps {
    defaultValues?: Partial<TodoFormData>;
    onSubmit: (data: TodoFormData) => Promise<void>;
    isLoading?: boolean;
    submitLabel?: string;
    onCancel?: () => void;
}

export function TodoForm({
    defaultValues,
    onSubmit,
    isLoading,
    submitLabel = "Save",
    onCancel
}: TodoFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<TodoFormData>({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(todoSchema) as any,
        defaultValues: {
            title: '',
            description: '',
            priority: 1,
            complete: false,
            ...defaultValues,
        },
    });

    return (
        <form onSubmit={handleSubmit((data) => onSubmit(data))} className="space-y-4">
            <Input
                label="Title"
                placeholder="What needs to be done?"
                error={errors.title?.message}
                {...register('title')}
            />

            <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Description
                </label>
                <textarea
                    rows={3}
                    className={`flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-800 dark:border-gray-600 dark:text-white ${errors.description ? 'border-red-500 focus:ring-red-500' : ''
                        }`}
                    placeholder="Add details..."
                    {...register('description')}
                />
                {errors.description && (
                    <p className="text-sm text-red-500">{errors.description.message}</p>
                )}
            </div>

            <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Priority
                </label>
                <select
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                    {...register('priority', { valueAsNumber: true })}
                >
                    <option value={1}>Low</option>
                    <option value={2}>Medium</option>
                    <option value={3}>High</option>
                    <option value={4}>Very High</option>
                    <option value={5}>Critical</option>
                </select>
                {errors.priority && (
                    <p className="text-sm text-red-500">{errors.priority.message}</p>
                )}
            </div>

            <div className="flex justify-end gap-3 pt-4">
                {onCancel && (
                    <Button type="button" variant="ghost" onClick={onCancel} disabled={isLoading}>
                        Cancel
                    </Button>
                )}
                <Button type="submit" isLoading={isLoading}>
                    {submitLabel}
                </Button>
            </div>
        </form>
    );
}
