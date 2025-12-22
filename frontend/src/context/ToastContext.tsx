'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
    id: string;
    type: ToastType;
    message: string;
}

interface ToastContextType {
    toasts: Toast[];
    addToast: (type: ToastType, message: string) => void;
    removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = useCallback((type: ToastType, message: string) => {
        const id = Math.random().toString(36).substring(2, 9);
        setToasts((prev) => [...prev, { id, type, message }]);
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 5000);
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
            {children}
            <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={cn(
                            "flex min-w-[300px] items-center gap-2 rounded-lg p-4 shadow-lg transition-all animate-in slide-in-from-right-full",
                            {
                                "bg-green-50 text-green-900 border border-green-200 dark:bg-green-900/20 dark:text-green-100 dark:border-green-800": toast.type === 'success',
                                "bg-red-50 text-red-900 border border-red-200 dark:bg-red-900/20 dark:text-red-100 dark:border-red-800": toast.type === 'error',
                                "bg-blue-50 text-blue-900 border border-blue-200 dark:bg-blue-900/20 dark:text-blue-100 dark:border-blue-800": toast.type === 'info',
                            }
                        )}
                    >
                        {toast.type === 'success' && <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />}
                        {toast.type === 'error' && <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />}
                        {toast.type === 'info' && <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />}

                        <p className="flex-1 text-sm font-medium">{toast.message}</p>

                        <button
                            onClick={() => removeToast(toast.id)}
                            className="rounded-full p-1 hover:bg-black/5 dark:hover:bg-white/10"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return {
        toast: (opts: { title: string; variant?: 'default' | 'destructive' | 'success' }) => {
            // Adapting to match typical shadcn/popular API if needed, or keeping simple
            // For now, mapping variant to type
            let type: ToastType = 'info';
            if (opts.variant === 'destructive') type = 'error';
            if (opts.variant === 'success') type = 'success';
            context.addToast(type, opts.title);
        },
        // Direct methods
        success: (msg: string) => context.addToast('success', msg),
        error: (msg: string) => context.addToast('error', msg),
        info: (msg: string) => context.addToast('info', msg),
    };
}
