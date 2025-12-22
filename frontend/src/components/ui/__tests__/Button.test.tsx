import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button } from '@/components/ui/Button';
import userEvent from '@testing-library/user-event';

describe('Button Component', () => {
    it('should render with default variant', () => {
        render(<Button>Click me</Button>);

        const button = screen.getByRole('button', { name: /click me/i });
        expect(button).toBeInTheDocument();
        expect(button).toHaveTextContent('Click me');
    });

    it('should render with primary variant styling', () => {
        render(<Button variant="primary">Primary Button</Button>);

        const button = screen.getByRole('button', { name: /primary button/i });
        // Check for primary variant classes
        expect(button.className).toContain('bg-blue-600');
        expect(button.className).toContain('text-white');
    });

    it('should render with ghost variant styling', () => {
        render(<Button variant="ghost">Ghost Button</Button>);

        const button = screen.getByRole('button', { name: /ghost button/i });
        expect(button.className).toContain('hover:bg-gray-100');
    });

    it('should render with danger variant styling', () => {
        render(<Button variant="danger">Delete</Button>);

        const button = screen.getByRole('button', { name: /delete/i });
        expect(button.className).toContain('bg-red-600');
    });

    it('should handle click events', async () => {
        const user = userEvent.setup();
        const handleClick = vi.fn();

        render(<Button onClick={handleClick}>Click me</Button>);

        const button = screen.getByRole('button', { name: /click me/i });
        await user.click(button);

        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should be disabled when disabled prop is true', async () => {
        const user = userEvent.setup();
        const handleClick = vi.fn();

        render(<Button disabled onClick={handleClick}>Disabled Button</Button>);

        const button = screen.getByRole('button', { name: /disabled button/i });
        expect(button).toBeDisabled();

        // Attempt to click - should not trigger handler
        await user.click(button);
        expect(handleClick).not.toHaveBeenCalled();
    });

    it('should render with different sizes', () => {
        const { rerender } = render(<Button size="sm">Small</Button>);
        let button = screen.getByRole('button', { name: /small/i });
        // Small size uses h-8
        expect(button.className).toContain('h-8');

        rerender(<Button size="lg">Large</Button>);
        button = screen.getByRole('button', { name: /large/i });
        // Large size uses h-12
        expect(button.className).toContain('h-12');
    });

    it('should apply custom className', () => {
        render(<Button className="custom-class">Custom</Button>);

        const button = screen.getByRole('button', { name: /custom/i });
        expect(button.className).toContain('custom-class');
    });

    it('should show loading state when isLoading is true', () => {
        render(<Button isLoading>Loading Button</Button>);

        const button = screen.getByRole('button');
        expect(button).toBeDisabled();
        // Check for loading spinner
        const spinner = button.querySelector('.animate-spin');
        expect(spinner).toBeInTheDocument();
    });

    it('should render with secondary variant', () => {
        render(<Button variant="secondary">Secondary</Button>);

        const button = screen.getByRole('button', { name: /secondary/i });
        expect(button.className).toContain('bg-gray-200');
    });

    it('should render with outline variant', () => {
        render(<Button variant="outline">Outline</Button>);

        const button = screen.getByRole('button', { name: /outline/i });
        expect(button.className).toContain('border');
        expect(button.className).toContain('bg-transparent');
    });
});
