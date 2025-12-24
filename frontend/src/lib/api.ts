import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import {
  User, Todo, AuthResponse,
  CreateTodoRequest, UpdateTodoRequest,
  UpdateUserRequest, ChangePasswordRequest,
  CreateUserRequest
} from '@/types';

const API_URL =
  typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? 'http://localhost:8000'
    : 'https://prismtasks-render.onrender.com';

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json',
  },
});

const TOKEN_KEY = 'access_token';

const getToken = () =>
  typeof window === 'undefined' ? null : localStorage.getItem(TOKEN_KEY);

const setToken = (token: string | null) => {
  if (typeof window === 'undefined') return;
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
};

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const authEvents = new EventTarget();

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const isAuthCheckEndpoint = error.config?.url?.includes('/user/get_user');
    if (error.response?.status === 401 && !isAuthCheckEndpoint) {
      setToken(null);
      authEvents.dispatchEvent(new Event('logout'));
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: async (data: URLSearchParams) => {
    const res = await api.post<AuthResponse>('/auth/token', data, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    if (res.data.access_token) {
      setToken(res.data.access_token);
    }
    return res.data;
  },

  logout: async () => {
    setToken(null);
    return { ok: true };
  },

  register: (data: CreateUserRequest) =>
    api.post('/auth/', { ...data, role: 'user' }),

  me: () => api.get<User>('/user/get_user'),

  updateProfile: (data: UpdateUserRequest) =>
    api.put('/user/update_user', data),

  changePassword: (data: ChangePasswordRequest) =>
    api.patch('/user/change_password', data),

  deleteAccount: () => api.delete('/user/delete_account'),
};

export const todoApi = {
  getAll: () => api.get<Todo[]>('/'),
  create: (data: CreateTodoRequest) => api.post('/todo', data),
  update: (id: number, data: UpdateTodoRequest) =>
    api.put(`/todo/${id}`, data),
  delete: (id: number) => api.delete(`/todo/${id}`),
};
