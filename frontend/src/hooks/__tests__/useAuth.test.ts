import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useAuth } from '@/hooks/useAuth';
import { AuthProvider } from '@/context/AuthContext';
import { ToastProvider } from '@/context/ToastContext';
import { ReactNode } from 'react';
import React from 'react';

// Create a wrapper component with both ToastProvider and AuthProvider
const createWrapper = () => {
    const Wrapper = ({ children }: { children: ReactNode }) =>
        React.createElement(
            ToastProvider,
            null,
            React.createElement(AuthProvider, null, children)
        );
    Wrapper.displayName = 'TestWrapper';
    return Wrapper;
};

describe('useAuth Hook', () => {
    beforeEach(() => {
        // Clear localStorage before each test
        localStorage.clear();
    });

    it('should provide auth context values', async () => {
        const { result } = renderHook(() => useAuth(), {
            wrapper: createWrapper(),
        });

        // Wait for loading to finish
        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        // Verify all expected properties exist
        expect(result.current).toHaveProperty('user');
        expect(result.current).toHaveProperty('loading');
        expect(result.current).toHaveProperty('login');
        expect(result.current).toHaveProperty('register');
        expect(result.current).toHaveProperty('logout');
    });

    it('should start with no user when not authenticated', async () => {
        const { result } = renderHook(() => useAuth(), {
            wrapper: createWrapper(),
        });

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(result.current.user).toBeNull();
    });

    it('should have login function', () => {
        const { result } = renderHook(() => useAuth(), {
            wrapper: createWrapper(),
        });

        expect(typeof result.current.login).toBe('function');
    });

    it('should have register function', () => {
        const { result } = renderHook(() => useAuth(), {
            wrapper: createWrapper(),
        });

        expect(typeof result.current.register).toBe('function');
    });

    it('should have logout function', () => {
        const { result } = renderHook(() => useAuth(), {
            wrapper: createWrapper(),
        });

        expect(typeof result.current.logout).toBe('function');
    });
});
