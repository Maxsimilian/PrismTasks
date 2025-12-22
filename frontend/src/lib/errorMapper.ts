import { AxiosError } from "axios";

/**
 * Extract a human-readable error message from an API error.
 */
export const getErrorMessage = (error: unknown): string => {
    if (error instanceof AxiosError) {
        if (error.response?.data?.detail) {
            if (typeof error.response.data.detail === 'string') {
                return error.response.data.detail;
            }
            // Handle array of errors (FastAPI 422)
            if (Array.isArray(error.response.data.detail)) {
                return error.response.data.detail
                    .map((e: { msg: string; loc?: (string | number)[] }) => {
                        if (e.loc && e.loc.length > 0) {
                            const field = e.loc[e.loc.length - 1];
                            return `${field}: ${e.msg}`;
                        }
                        return e.msg;
                    })
                    .join(", ");
            }
        }
        return error.message;
    }
    if (error instanceof Error) return error.message;
    return "An unexpected error occurred";
};

/**
 * Handle API errors and optionally set field errors in a react-hook-form.
 */
export const handleApiError = (
    error: unknown,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setError?: any,
    toastError?: (msg: string) => void
): string => {
    const message = getErrorMessage(error);

    // If it's a validation error and we have setError, map fields
    if (setError && error instanceof AxiosError && error.response?.status === 422) {
        const detail = error.response.data.detail;
        if (Array.isArray(detail)) {
            detail.forEach((e: { msg: string; loc?: (string | number)[] }) => {
                if (e.loc && e.loc.length > 0) {
                    const field = e.loc[e.loc.length - 1];
                    setError(field, { type: 'server', message: e.msg });
                }
            });
        }
    }

    if (toastError) {
        toastError(message);
    }

    return message;
};
