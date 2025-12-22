export interface User {
    id: number;
    email: string;
    username: string;
    first_name: string;
    last_name: string;
    role: string;
    phone_number?: string | null;
}

export interface Todo {
    id: number;
    title: string;
    description: string;
    priority: number;
    complete: boolean;
    owner_id: number;
}

export interface AuthResponse {
    ok?: boolean;
    access_token?: string;
    token_type?: string;
}

export interface CreateTodoRequest {
    title: string;
    description: string;
    priority: number;
    complete?: boolean;
}

export interface CreateUserRequest {
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    password: string;
    phone_number?: string;
}

export type UpdateTodoRequest = Partial<CreateTodoRequest>;

export interface UpdateUserRequest {
    first_name?: string;
    last_name?: string;
    phone_number?: string;
    email?: string;
    username?: string;
}

export interface ChangePasswordRequest {
    old_password: string;
    new_password: string;
}
