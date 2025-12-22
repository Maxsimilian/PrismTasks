import axios, { AxiosError } from 'axios';
import {
    User, Todo, AuthResponse,
    CreateTodoRequest, UpdateTodoRequest,
    UpdateUserRequest, ChangePasswordRequest,
    CreateUserRequest
} from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Event bus for auth errors
export const authEvents = new EventTarget();

api.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        // Only trigger logout redirect for 401 errors on protected endpoints
        // Skip for /user/get_user since that's used for initial auth checking
        const isAuthCheckEndpoint = error.config?.url?.includes('/user/get_user');
        if (error.response?.status === 401 && !isAuthCheckEndpoint) {
            authEvents.dispatchEvent(new Event('logout'));
        }
        return Promise.reject(error);
    }
);

export const authApi = {
    login: (data: URLSearchParams) =>
        api.post<AuthResponse>('/auth/login', data, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }),
    logout: () => api.post('/auth/logout'),
    register: (data: CreateUserRequest) => api.post('/auth/', { ...data, role: 'user' }),
    me: () => api.get<User>('/user/get_user'),
    updateProfile: (data: UpdateUserRequest) => api.put('/user/update_user', data),
    changePassword: (data: ChangePasswordRequest) => api.patch('/user/change_password', data),
};

export const todoApi = {
    getAll: () => api.get<Todo[]>('/'),
    create: (data: CreateTodoRequest) => api.post('/todo', data),
    update: (id: number, data: UpdateTodoRequest) => api.put(`/todo/${id}`, data),
    delete: (id: number) => api.delete(`/todo/${id}`),
};
