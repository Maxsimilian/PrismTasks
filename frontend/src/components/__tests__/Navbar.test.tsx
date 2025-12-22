import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Navbar } from '@/components/Navbar';
import userEvent from '@testing-library/user-event';

// Mock the useAuth hook
vi.mock('@/hooks/useAuth', () => ({
    useAuth: vi.fn(),
}));

const mockUseAuth = vi.mocked(await import('@/hooks/useAuth')).useAuth;

describe('Navbar Component', () => {
    it('should render the PrismTasks logo', () => {
        mockUseAuth.mockReturnValue({
            user: null,
            loading: false,
            login: vi.fn(),
            register: vi.fn(),
            logout: vi.fn(),
            refreshUser: vi.fn(),
        });

        render(<Navbar />);

        expect(screen.getByText(/Prism/)).toBeInTheDocument();
        expect(screen.getByText(/Tasks/)).toBeInTheDocument();
    });

    it('should show Sign In and Get Started buttons when not authenticated', () => {
        mockUseAuth.mockReturnValue({
            user: null,
            loading: false,
            login: vi.fn(),
            register: vi.fn(),
            logout: vi.fn(),
            refreshUser: vi.fn(),
        });

        render(<Navbar />);

        expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /get started/i })).toBeInTheDocument();
    });

    it('should show user profile and logout button when authenticated', () => {
        const mockUser = {
            id: 1,
            username: 'testuser',
            email: 'test@example.com',
            first_name: 'Test',
            last_name: 'User',
            role: 'user',
        };

        mockUseAuth.mockReturnValue({
            user: mockUser,
            loading: false,
            login: vi.fn(),
            register: vi.fn(),
            logout: vi.fn(),
            refreshUser: vi.fn(),
        });

        render(<Navbar />);

        expect(screen.getByText('testuser')).toBeInTheDocument();
        expect(screen.getByTitle(/logout/i)).toBeInTheDocument();
    });

    it('should call logout function when logout button is clicked', async () => {
        const user = userEvent.setup();
        const mockLogout = vi.fn();
        const mockUser = {
            id: 1,
            username: 'testuser',
            email: 'test@example.com',
            first_name: 'Test',
            last_name: 'User',
            role: 'user',
        };

        mockUseAuth.mockReturnValue({
            user: mockUser,
            loading: false,
            login: vi.fn(),
            register: vi.fn(),
            logout: mockLogout,
            refreshUser: vi.fn(),
        });

        render(<Navbar />);

        const logoutButton = screen.getByTitle(/logout/i);
        await user.click(logoutButton);

        expect(mockLogout).toHaveBeenCalledTimes(1);
    });

    it('should render dark mode toggle', () => {
        mockUseAuth.mockReturnValue({
            user: null,
            loading: false,
            login: vi.fn(),
            register: vi.fn(),
            logout: vi.fn(),
            refreshUser: vi.fn(),
        });

        render(<Navbar />);

        const darkModeToggle = screen.getByRole('button', { name: /toggle dark mode/i });
        expect(darkModeToggle).toBeInTheDocument();
    });

    it('should link to dashboard when user is authenticated', () => {
        const mockUser = {
            id: 1,
            username: 'testuser',
            email: 'test@example.com',
            first_name: 'Test',
            last_name: 'User',
            role: 'user',
        };

        mockUseAuth.mockReturnValue({
            user: mockUser,
            loading: false,
            login: vi.fn(),
            register: vi.fn(),
            logout: vi.fn(),
            refreshUser: vi.fn(),
        });

        render(<Navbar />);

        const logoLink = screen.getByRole('link', { name: /prismtasks/i });
        expect(logoLink).toHaveAttribute('href', '/dashboard');
    });

    it('should link to home when user is not authenticated', () => {
        mockUseAuth.mockReturnValue({
            user: null,
            loading: false,
            login: vi.fn(),
            register: vi.fn(),
            logout: vi.fn(),
            refreshUser: vi.fn(),
        });

        render(<Navbar />);

        const logoLink = screen.getByRole('link', { name: /prismtasks/i });
        expect(logoLink).toHaveAttribute('href', '/');
    });

    it('should have proper styling classes', () => {
        mockUseAuth.mockReturnValue({
            user: null,
            loading: false,
            login: vi.fn(),
            register: vi.fn(),
            logout: vi.fn(),
            refreshUser: vi.fn(),
        });

        const { container } = render(<Navbar />);
        const nav = container.querySelector('nav');

        expect(nav?.className).toContain('fixed');
        expect(nav?.className).toContain('backdrop-blur');
    });

    it('should truncate long usernames', () => {
        const mockUser = {
            id: 1,
            username: 'verylongusernamethatshouldbetruncat',
            email: 'test@example.com',
            first_name: 'Test',
            last_name: 'User',
            role: 'user',
        };

        mockUseAuth.mockReturnValue({
            user: mockUser,
            loading: false,
            login: vi.fn(),
            register: vi.fn(),
            logout: vi.fn(),
            refreshUser: vi.fn(),
        });

        render(<Navbar />);

        const usernameElement = screen.getByText(mockUser.username);
        expect(usernameElement.className).toContain('truncate');
        expect(usernameElement.className).toContain('max-w-[150px]');
    });
});
