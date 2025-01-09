import { z } from 'zod';

const userLoginValidationSchema = z.object({
    body: z.object({
        identifier: z
            .string({
                invalid_type_error: 'User identifier must be a string',
                required_error: 'User identifier is required'
            })
            .refine(value => {
                // Check if input matches email format or phone number format
                return /^\+(?:[0-9] ?){6,14}[0-9]$/.test(value) || z.string().email().safeParse(value).success;
            }, {
                message: 'User identifier must be a valid email or phone number'
            }),
        password: z
            .string({
                invalid_type_error: 'User password must be string',
                required_error: 'User password is required'
            })
            .min(6, { message: 'Password must be greater than or equal to 6 characters' })
            .max(100, { message: 'Password must be less than or equal to 100 characters' })
            .trim()
    })
});

const refreshTokenValidationSchema = z.object({
    cookies: z.object({
        refreshToken: z.string({
            invalid_type_error: 'Refresh token must be string',
            required_error: 'Refresh token is required'
        })
    })
});

const identifierValidations = z.object({
    body: z.object({
        phone: z
            .string({
                invalid_type_error: 'Phone must be string',
                required_error: 'Phone is required'
            }).optional(),

        email: z
            .string({
                invalid_type_error: 'User email must be string',
                required_error: 'User email is required'
            })
            .email({
                message: 'Invalid email address'
            }).optional()

    })
});

const forgetPasswordValidationSchema = z.object({
    body: z.object({
        password: z
            .string({
                invalid_type_error: 'Password must be string',
                required_error: 'Password is required'
            })
            .min(6, { message: 'Password must be greater than or equal to 6 characters' })
            .max(100, { message: 'Password must be less than or equal to 100 characters' }),
        confirm_password: z
            .string({
                invalid_type_error: 'Confirm password must be string',
                required_error: 'Confirm password is required'
            })
            .min(6, { message: 'Password must be greater than or equal to 6 characters' })
            .max(100, { message: 'Password must be less than or equal to 100 characters' })

    })
});

const passwordUpdateValidationSchema = z.object({
    body: z.object({
        old_password: z
            .string({
                invalid_type_error: 'Old password must be string',
                required_error: 'Old password is required'
            })
            .min(6, { message: 'Password must be greater than or equal to 6 characters' })
            .max(100, { message: 'Password must be less than or equal to 100 characters' }),
        password: z
            .string({
                invalid_type_error: 'Password must be string',
                required_error: 'Password is required'
            })
            .min(6, { message: 'Password must be greater than or equal to 6 characters' })
            .max(100, { message: 'Password must be less than or equal to 100 characters' }),
        confirm_password: z
            .string({
                invalid_type_error: 'Confirm password must be string',
                required_error: 'Confirm password is required'
            })
            .min(6, { message: 'Password must be greater than or equal to 6 characters' })
            .max(100, { message: 'Password must be less than or equal to 100 characters' })

    })
});


export const authValidations = {
    userLoginValidationSchema,
    refreshTokenValidationSchema,
    forgetPasswordValidationSchema,
    identifierValidations,
    passwordUpdateValidationSchema
};