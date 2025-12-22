import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DarkModeToggle } from '@/components/DarkModeToggle';

describe('DarkModeToggle', () => {
    it('should render the toggle button', () => {
        render(<DarkModeToggle />);

        const button = screen.getByRole('button', { name: /toggle dark mode/i });
        expect(button).toBeInTheDocument();
    });

    it('should display moon icon in light mode', () => {
        // Ensure we start in light mode
        document.documentElement.classList.remove('dark');

        render(<DarkModeToggle />);

        // The moon icon should be visible (opacity-100) in light mode
        const button = screen.getByRole('button', { name: /toggle dark mode/i });
        expect(button).toHaveAttribute('title', 'Switch to dark mode');
    });

    it('should toggle dark mode when clicked', () => {
        // Start in light mode
        document.documentElement.classList.remove('dark');
        localStorage.removeItem('theme');

        render(<DarkModeToggle />);

        const button = screen.getByRole('button', { name: /toggle dark mode/i });

        // Click to enable dark mode
        fireEvent.click(button);

        // Check that dark class was added
        expect(document.documentElement.classList.contains('dark')).toBe(true);
        expect(localStorage.getItem('theme')).toBe('dark');
    });

    it('should have proper accessibility attributes', () => {
        render(<DarkModeToggle />);

        const button = screen.getByRole('button', { name: /toggle dark mode/i });

        expect(button).toHaveAttribute('aria-label', 'Toggle dark mode');
        expect(button).toHaveAttribute('title');
    });

    it('should apply hover styles', () => {
        render(<DarkModeToggle />);

        const button = screen.getByRole('button', { name: /toggle dark mode/i });

        // Check that button has hover-related classes
        expect(button.className).toContain('hover:scale-105');
        expect(button.className).toContain('hover:shadow-md');
    });

    it('should update localStorage when toggling', () => {
        // Start fresh
        localStorage.clear();
        document.documentElement.classList.remove('dark');

        render(<DarkModeToggle />);

        const button = screen.getByRole('button', { name: /toggle dark mode/i });

        // Toggle to dark
        fireEvent.click(button);
        expect(localStorage.getItem('theme')).toBe('dark');

        // Toggle back to light
        fireEvent.click(button);
        expect(localStorage.getItem('theme')).toBe('light');
    });
});
