'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { z } from 'zod';
import { updateUserSchema } from '@/lib/validators';
import { authApi } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/hooks/useToast';
import { handleApiError } from '@/lib/errorMapper';
import { User } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

type UpdateProfileData = z.infer<typeof updateUserSchema>;

export function UpdateUserForm({ user }: { user: User }) {
    const { refreshUser } = useAuth();
    const { success, error } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const { register, control, handleSubmit, setError, formState: { errors } } = useForm<UpdateProfileData>({
        resolver: zodResolver(updateUserSchema),
        defaultValues: {
            first_name: user?.first_name || '',
            last_name: user?.last_name || '',
            email: user?.email || '',
            phone_number: user?.phone_number || '',
            username: user?.username || ''
        }
    });

    const onSubmit = async (data: UpdateProfileData) => {
        setIsLoading(true);
        try {
            await authApi.updateProfile(data);
            await refreshUser();
            success('Profile updated successfully');
        } catch (err) {
            handleApiError(err, setError, error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                    label="First Name"
                    {...register('first_name')}
                    error={errors.first_name?.message}
                    disabled={isLoading}
                />
                <Input
                    label="Last Name"
                    {...register('last_name')}
                    error={errors.last_name?.message}
                    disabled={isLoading}
                />
            </div>

            <Input
                label="Username"
                {...register('username')}
                error={errors.username?.message}
                disabled={isLoading}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                    label="Email"
                    type="email"
                    {...register('email')}
                    error={errors.email?.message}
                    disabled={isLoading}
                />
                <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Phone Number
                    </label>
                    <Controller
                        name="phone_number"
                        control={control}
                        rules={{
                            validate: (value) => {
                                if (!value) return true; // Optional
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
            </div>

            <div className="pt-2 flex justify-end">
                <Button type="submit" isLoading={isLoading} className="w-full md:w-auto">
                    Save Changes
                </Button>
            </div>
        </form>
    );
}
