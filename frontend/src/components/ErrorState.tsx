import { AlertTriangle, RefreshCcw } from 'lucide-react';
import { Button } from './ui/Button';

interface ErrorStateProps {
    message: string;
    onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
    return (
        <div className="flex flex-col items-center justify-center p-8 text-center rounded-lg border border-red-200 bg-red-50 dark:bg-red-900/10 dark:border-red-800">
            <AlertTriangle className="h-10 w-10 text-red-500 mb-4" />
            <h3 className="text-lg font-semibold text-red-900 dark:text-red-200 mb-2">Something went wrong</h3>
            <p className="text-red-600 dark:text-red-300 mb-6">{message}</p>
            {onRetry && (
                <Button onClick={onRetry} variant="outline" className="border-red-200 hover:bg-red-100 dark:border-red-700 dark:hover:bg-red-900/30">
                    <RefreshCcw className="mr-2 h-4 w-4" />
                    Try Again
                </Button>
            )}
        </div>
    );
}
