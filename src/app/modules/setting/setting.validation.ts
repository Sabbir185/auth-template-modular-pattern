import { z } from "zod";

const postSettingValidationSchema = z.object({
    body: z.object({
        site_name: z
            .string({
                invalid_type_error: 'site_name name must be string',
                required_error: 'site_name name is required'
            }).optional(),

        email: z
            .string({
                invalid_type_error: 'Email must be string',
                required_error: 'Email is required'
            })
            .email({
                message: "Invalid email address"
            }).optional(),
        phone: z
            .string({
                invalid_type_error: 'phone number must be string',
                required_error: 'phone number is required'
            }).optional(),
        address: z
            .string({
                invalid_type_error: 'address must be string',
                required_error: 'address is required'
            }).optional(),
        description: z
            .string({
                invalid_type_error: 'description must be string',
                required_error: 'description is required'
            }).optional(),
        logo: z
            .string({
                invalid_type_error: 'logo must be string',
                required_error: 'logo is required'
            }).optional(),
        currency_code: z
            .string({
                invalid_type_error: 'currency_code must be string',
                required_error: 'currency_code is required'
            }).optional(),
        currency_symbol: z
            .string({
                invalid_type_error: 'currency_symbol must be string',
                required_error: 'currency_symbol is required'
            }).optional(),
    })
})


export const SettingValidations = {
    postSettingValidationSchema,
}