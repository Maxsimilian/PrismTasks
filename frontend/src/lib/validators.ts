import { z } from "zod";

export const loginSchema = z.object({
    username: z.string().min(1, "Username is required"),
    password: z.string().min(1, "Password is required"),
});

export const registerSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z.string().email("Invalid email address"),
    first_name: z.string().min(1, "First name is required"),
    last_name: z.string().min(1, "Last name is required"),
    password: z.string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Za-z]/, "Include at least one letter")
        .regex(/[0-9]/, "Must contain at least one number")
        .regex(/[^A-Za-z0-9]/, "Include at least one special character"),
    phone_number: z.string().optional(),
});

export const todoSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z.string().min(3, "Description must be at least 3 characters").max(100, "Max 100 characters"),
    priority: z.coerce.number().min(1).max(5),
    complete: z.boolean().default(false),
});

export const updateUserSchema = z.object({
    first_name: z.string().min(1, "First name is required").optional(),
    last_name: z.string().min(1, "Last name is required").optional(),
    email: z.string().email().optional(),
    phone_number: z.string().optional(),
    username: z.string().optional(),
});

export const changePasswordSchema = z.object({
    old_password: z.string().min(1, "Old password is required"),
    new_password: z.string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Za-z]/, "Include at least one letter")
        .regex(/[0-9]/, "Must contain at least one number")
        .regex(/[^A-Za-z0-9]/, "Include at least one special character"),
    confirm_password: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.new_password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
});
