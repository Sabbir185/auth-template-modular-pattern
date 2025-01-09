import { z } from 'zod';

const registerValidationSchema = z.object({
    body: z.object({
        otp: z
            .string({
                invalid_type_error: 'OTP must be string',
                required_error: 'OTP is required'
            }).trim(),
        name: z
            .string({
                invalid_type_error: 'User name must be string',
                required_error: 'User name is required'
            })
            .max(200, { message: 'Name must be less than or equal to 50 characters' }).trim(),
        email: z
            .string({
                invalid_type_error: 'User email must be string',
                required_error: 'User email is required'
            })
            .email({ message: 'Invalid email address' }).trim(),
        phone: z
            .string({
                invalid_type_error: 'Phone must be string',
                required_error: 'Phone is required'
            }).trim(),
        password: z
            .string({
                invalid_type_error: 'User password must be string',
                required_error: 'User password is required'
            })
            .min(6, { message: 'Password must be greater than or equal to 6 characters' })
            .max(100, { message: 'Password must be less than or equal to 100 characters' })
            .trim(),
        role: z
            .enum(['user', 'driver', 'admin', 'employee'], {
                invalid_type_error: 'User role must be string',
                required_error: 'User role is required'
            })
    })
});

const updateUserProfileValidationSchema = z.object({
    body: z.object({
        name: z
            .string({
                invalid_type_error: 'User name must be string',
                required_error: 'User name is required'
            })
            .max(50, { message: 'Name must be less than or equal to 50 characters' }).optional(),
        email: z
            .string({
                invalid_type_error: 'User email must be string',
                required_error: 'User email is required'
            })
            .email({ message: 'Invalid email address' })
            .optional(),
        phone: z
            .string({
                invalid_type_error: 'Phone must be string',
                required_error: 'Phone is required'
            })
            .optional(),
        image: z
            .string({
                invalid_type_error: 'image must be string',
            })
            .optional(),
        city: z
            .string({
                invalid_type_error: 'City must be string',
                required_error: 'City is required'
            })
            .optional(),
        address: z
            .string({
                invalid_type_error: 'Address must be string',
                required_error: 'Address is required'
            })
            .max(250, { message: 'Address must be less than or equal to 250 characters' })
            .optional(),
        gender: z
            .enum(['male', 'female', 'other'], {
                invalid_type_error: 'User gender must be male, female, or other',
                required_error: 'User gender is required'
            }).optional(),
        password: z
            .string({
                invalid_type_error: 'User password must be string',
                required_error: 'User password is required'
            })
            .min(6, { message: 'Password must be greater than or equal to 6 characters' })
            .max(100, { message: 'Password must be less than or equal to 100 characters' })
            .trim().optional(),
        role: z
            .enum(['user', 'driver', 'admin', 'employee'], {
                invalid_type_error: 'User role must be string',
                required_error: 'User role is required'
            }).optional()
    })
});

export const UserValidations = {
    registerValidationSchema,
    updateUserProfileValidationSchema
};