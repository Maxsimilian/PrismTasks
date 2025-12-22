'use client';

import { useAuth } from "@/hooks/useAuth";
import { UpdateUserForm } from "@/components/UpdateUserForm";
import { ChangePasswordForm } from "@/components/ChangePasswordForm";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { User, Shield, Key, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function ProfilePage() {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    if (loading || !user) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-pulse">
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                <div className="grid gap-8 md:grid-cols-2">
                    <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
                    <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
            <div className="max-w-4xl mx-auto px-4 py-8 pb-24 space-y-8 animate-in fade-in duration-500">
                <div className="flex flex-col gap-2">
                    <Button variant="ghost" onClick={() => router.back()} className="self-start pl-0 hover:bg-transparent hover:text-blue-600">
                        <ChevronLeft className="h-4 w-4 mr-1" /> Back
                    </Button>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                            <User className="h-6 w-6" />
                        </div>
                        Account Settings
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 ml-14">Manage your personal information and security preferences.</p>
                </div>

                <div className="grid gap-8 lg:grid-cols-2">
                    {/* Profile Details Card */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                <User className="h-5 w-5 text-gray-400" />
                                Personal Information
                            </h2>
                            <p className="text-sm text-gray-500 mt-1 pl-7">Update your identification details.</p>
                        </div>
                        <div className="p-6">
                            <UpdateUserForm user={user} />
                        </div>
                    </div>

                    {/* Security Card */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden h-fit">
                        <div className="p-6 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                <Shield className="h-5 w-5 text-gray-400" />
                                Security
                            </h2>
                            <p className="text-sm text-gray-500 mt-1 pl-7">Ensure your account stays protected.</p>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="flex items-start gap-4 p-4 bg-yellow-50 dark:bg-yellow-900/10 rounded-lg border border-yellow-100 dark:border-yellow-900/20">
                                <Key className="h-5 w-5 text-yellow-600 mt-0.5" />
                                <div>
                                    <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-500">Password Requirements</h3>
                                    <p className="text-xs text-yellow-700 dark:text-yellow-600 mt-1 leading-relaxed">
                                        Use a strong password with at least 8 characters, including uppercase, lowercase, numbers, and symbols.
                                    </p>
                                </div>
                            </div>
                            <ChangePasswordForm />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
