'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { changePasswordSchema } from '@/lib/validators';
import { authApi } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/hooks/useToast';
import { handleApiError } from '@/lib/errorMapper';

type ChangePasswordData = z.infer<typeof changePasswordSchema>;

export function ChangePasswordForm() {
    const { success, error } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const { register, handleSubmit, reset, setError, formState: { errors } } = useForm<ChangePasswordData>({
        resolver: zodResolver(changePasswordSchema)
    });

    const onSubmit = async (data: ChangePasswordData) => {
        setIsLoading(true);
        try {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { confirm_password, ...apiData } = data;
            await authApi.changePassword(apiData);
            success('Password changed successfully');
            reset();
        } catch (err) {
            handleApiError(err, setError, error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
                label="Old Password"
                type="password"
                {...register('old_password')}
                error={errors.old_password?.message}
                disabled={isLoading}
            />
            <div className="space-y-1">
                <Input
                    label="New Password"
                    type="password"
                    {...register('new_password')}
                    error={errors.new_password?.message}
                    disabled={isLoading}
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Password must be at least 8 characters and include a letter, a number, and a special character.
                </p>
            </div>
            <Input
                label="Confirm New Password"
                type="password"
                {...register('confirm_password')}
                error={errors.confirm_password?.message}
                disabled={isLoading}
            />
            <div className="pt-2 flex justify-end">
                <Button type="submit" variant="secondary" isLoading={isLoading} className="w-full md:w-auto text-yellow-700 bg-yellow-50 hover:bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400 dark:hover:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-900/50">
                    Update Password
                </Button>
            </div>
        </form>
    );
}
