'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '@/lib/validators';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Link from 'next/link';
import { Eye, EyeOff, KeyRound, User } from 'lucide-react';
import { z } from 'zod';

type LoginData = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const { login } = useAuth();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginData>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginData) => {
        setLoading(true);
        try {
            const formData = new URLSearchParams();
            formData.append('username', data.username);
            formData.append('password', data.password);
            await login(formData);
        } catch {
            // Handled by context toast
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center p-4 bg-gray-50 dark:bg-gray-950">
            <div className="w-full max-w-md space-y-8 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
                <div className="text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Welcome back</h2>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        Sign in to your account
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    <div className="space-y-4">
                        <div className="relative">
                            <Input
                                label="Username"
                                error={errors.username?.message}
                                {...register('username')}
                                className="pl-10"
                            />
                            <User className="absolute left-3 top-[34px] h-4 w-4 text-gray-400" />
                        </div>

                        <div className="relative">
                            <Input
                                label="Password"
                                type={showPassword ? 'text' : 'password'}
                                error={errors.password?.message}
                                {...register('password')}
                                className="pl-10 pr-10"
                            />
                            <KeyRound className="absolute left-3 top-[34px] h-4 w-4 text-gray-400" />
                            <button
                                type="button"
                                className="absolute right-3 top-[34px] text-gray-400 hover:text-gray-600 focus:outline-none"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                    </div>

                    <Button type="submit" className="w-full" isLoading={loading}>
                        Sign in
                    </Button>

                    <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                        Don&apos;t have an account?{' '}
                        <Link href="/register" className="font-medium text-blue-600 hover:text-blue-500">
                            Register here
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
