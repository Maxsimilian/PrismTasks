'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { LogOut, User, CheckSquare } from 'lucide-react';
import { DarkModeToggle } from './DarkModeToggle';

export function Navbar() {
    const { user, logout } = useAuth();

    return (
        <nav className="fixed top-0 z-50 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <Link href={user ? "/dashboard" : "/"} className="flex-shrink-0 flex items-center gap-2.5 group">
                            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-xl shadow-lg shadow-blue-600/20 group-hover:shadow-blue-600/30 group-hover:scale-105 transition-all duration-300">
                                <CheckSquare className="h-5 w-5 text-white" />
                            </div>
                            <span className="font-bold text-xl tracking-tight text-gray-900 dark:text-white">
                                Prism<span className="text-blue-600 dark:text-blue-400">Tasks</span>
                            </span>
                        </Link>
                    </div>

                    <div className="hidden sm:flex sm:items-center sm:space-x-4">
                        <DarkModeToggle />
                        {user ? (
                            <>
                                <Link href="/profile">
                                    <Button variant="ghost" className="group flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full px-4 h-10 transition-all">
                                        <div className="h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                            <User className="h-3.5 w-3.5" />
                                        </div>
                                        <span className="max-w-[150px] truncate text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white">
                                            {user.username}
                                        </span>
                                    </Button>
                                </Link>
                                <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-1" />
                                <Button
                                    variant="ghost"
                                    onClick={() => logout()}
                                    size="sm"
                                    className="text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors rounded-full w-10 h-10 p-0"
                                    title="Logout"
                                >
                                    <LogOut className="h-4.5 w-4.5" />
                                </Button>
                            </>
                        ) : (
                            <div className="flex gap-3 items-center">
                                <Link href="/login">
                                    <Button variant="ghost" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium">
                                        Sign In
                                    </Button>
                                </Link>
                                <Link href="/register">
                                    <Button className="rounded-full shadow-md shadow-blue-600/20 hover:shadow-lg hover:shadow-blue-600/30 transition-all">
                                        Get Started
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
