'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { registerSchema } from '@/lib/validators';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import { z } from 'zod';
import { handleApiError } from '@/lib/errorMapper';
import { cn } from '@/lib/utils';

type RegisterData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
    const { register: registerAuth } = useAuth();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        setError,
        control,
        formState: { errors },
    } = useForm<RegisterData>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            username: '',
            email: '',
            first_name: '',
            last_name: '',
            password: '',
            phone_number: ''
        }
    });

    const onSubmit = async (data: RegisterData) => {
        setLoading(true);
        try {
            await registerAuth(data);
            // AuthProvider handles redirect
        } catch (error) {
            handleApiError(error, setError);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center p-4 bg-gray-50 dark:bg-gray-950">
            <div className="w-full max-w-md space-y-8 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
                <div className="text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Create an account</h2>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        Get started with PrismTasks
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    <div className="space-y-4">
                        <Input
                            label="Username"
                            error={errors.username?.message}
                            {...register('username')}
                        />

                        <Input
                            label="Email"
                            type="email"
                            error={errors.email?.message}
                            {...register('email')}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                label="First Name"
                                error={errors.first_name?.message}
                                {...register('first_name')}
                            />
                            <Input
                                label="Last Name"
                                error={errors.last_name?.message}
                                {...register('last_name')}
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Phone Number (Optional)
                            </label>
                            <Controller
                                name="phone_number"
                                control={control}
                                rules={{
                                    validate: (value) => {
                                        if (!value) return true;
                                        return isValidPhoneNumber(value) || "Invalid phone number";
                                    }
                                }}
                                render={({ field }) => (
                                    <PhoneInput
                                        {...field}
                                        defaultCountry="GB"
                                        international={true}
                                        withCountryCallingCode={true}
                                        placeholder="Enter phone number"
                                        className={cn(
                                            "flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:ring-offset-gray-950",
                                            errors.phone_number ? "border-red-500 focus:ring-red-500" : ""
                                        )}
                                        onChange={(value) => field.onChange(value || '')}
                                    />
                                )}
                            />
                            {errors.phone_number && (
                                <p className="text-sm text-red-500 mt-1">{errors.phone_number.message}</p>
                            )}
                        </div>

                        <div className="relative">
                            <Input
                                label="Password"
                                type={showPassword ? 'text' : 'password'}
                                error={errors.password?.message}
                                {...register('password')}
                                className="pr-10"
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-[34px] text-gray-400 hover:text-gray-600 focus:outline-none"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                Password must be at least 8 characters and include a letter, a number, and a special character.
                            </p>
                        </div>
                    </div>

                    <Button type="submit" className="w-full" isLoading={loading}>
                        Sign up
                    </Button>

                    <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                        Already have an account?{' '}
                        <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
                            Sign in
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
