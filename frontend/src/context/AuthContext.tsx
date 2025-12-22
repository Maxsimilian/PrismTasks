'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { User, CreateUserRequest } from '@/types';
import { authApi, authEvents } from '@/lib/api';
import { useToast } from '@/hooks/useToast';
import { getErrorMessage } from '@/lib/errorMapper';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (data: URLSearchParams) => Promise<void>;
    register: (data: CreateUserRequest) => Promise<void>;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const { error: toastError, success: toastSuccess, info: toastInfo } = useToast();

    const refreshUser = useCallback(async () => {
        try {
            console.log('[AuthContext] Fetching user data...');
            const response = await authApi.me();
            console.log('[AuthContext] User fetched:', response.data?.username);
            setUser(response.data);
        } catch {
            console.log('[AuthContext] Failed to fetch user (not authenticated)');
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    // Initial check
    useEffect(() => {
        refreshUser();
    }, [refreshUser]);

    // Listen for 401 events from api interceptor
    useEffect(() => {
        const handleLogout = () => {
            setUser(null);
            router.push('/login');
            toastInfo("Session expired. Please login again.");
        };

        authEvents.addEventListener('logout', handleLogout);
        return () => authEvents.removeEventListener('logout', handleLogout);
    }, [router, toastInfo]);

    const login = async (data: URLSearchParams) => {
        try {
            console.log('[AuthContext] Starting login...');
            await authApi.login(data);
            console.log('[AuthContext] Login API complete, refreshing user...');
            await refreshUser();
            console.log('[AuthContext] User refreshed, redirecting to dashboard...');
            toastSuccess("Successfully logged in");
            router.push('/dashboard');
        } catch (err: unknown) {
            const msg = getErrorMessage(err);
            console.error('[AuthContext] Login failed:', msg);
            toastError(msg || "Login failed");
            throw err;
        }
    };

    const register = async (data: CreateUserRequest) => {
        try {
            await authApi.register(data);
            toastSuccess("Registration successful! Please login.");
            router.push('/login');
        } catch (err: unknown) {
            const msg = getErrorMessage(err);
            toastError(msg || "Registration failed");
            throw err;
        }
    };

    const logout = async () => {
        try {
            await authApi.logout();
            setUser(null);
            toastSuccess("Logged out successfully");
            router.push('/login');
        } catch {
            // Force logout even if API fails
            setUser(null);
            router.push('/login');
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
