'use client';

import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

export function DarkModeToggle() {
    const [isDark, setIsDark] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        // Check initial dark mode preference
        setTimeout(() => {
            const isDarkMode = document.documentElement.classList.contains('dark');
            setIsDark(isDarkMode);
        }, 0);
    }, []);

    const toggleDarkMode = () => {
        setIsAnimating(true);

        if (isDark) {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        } else {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        }
        setIsDark(!isDark);

        // Reset animation state
        setTimeout(() => setIsAnimating(false), 500);
    };

    return (
        <button
            onClick={toggleDarkMode}
            className="relative p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-gray-50 dark:hover:bg-gray-750 hover:scale-105 active:scale-95 transition-all duration-300 shadow-sm hover:shadow-md group"
            aria-label="Toggle dark mode"
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
            <div className="relative w-5 h-5">
                {/* Sun Icon */}
                <Sun
                    className={`absolute inset-0 h-5 w-5 text-amber-500 transition-all duration-500 ${isDark
                            ? 'opacity-100 rotate-0 scale-100'
                            : 'opacity-0 -rotate-90 scale-50'
                        } ${isAnimating ? 'animate-spin' : ''}`}
                />
                {/* Moon Icon */}
                <Moon
                    className={`absolute inset-0 h-5 w-5 text-indigo-600 dark:text-indigo-400 transition-all duration-500 ${!isDark
                            ? 'opacity-100 rotate-0 scale-100'
                            : 'opacity-0 rotate-90 scale-50'
                        }`}
                />
            </div>

            {/* Subtle glow effect on hover */}
            <div className="absolute inset-0 rounded-xl bg-blue-400/0 group-hover:bg-blue-400/5 dark:group-hover:bg-blue-400/10 transition-colors duration-300" />
        </button>
    );
}
