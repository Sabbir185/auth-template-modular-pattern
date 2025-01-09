import { z } from "zod";

const sendOTPValidationSchema = z.object({
    body: z.object({
        identifier: z
            .string({
                invalid_type_error: 'Identifier must be a string',
                required_error: 'Identifier is required'
            })
            .refine(value => {
                // Check if input matches email format or phone number format
                return /^\+(?:[0-9] ?){6,14}[0-9]$/.test(value) || z.string().email().safeParse(value).success;
            }, {
                message: 'Identifier must be a valid email or phone number'
            }),
        action: z.
            enum(['forget_password', 'signup', 'profile_update'], {
                invalid_type_error: "Action must be string",
                required_error: "Action is required"
            }),
        otp_option: z.
            enum(['sms', 'email'], {
                invalid_type_error: "OTP option must be string",
                required_error: "OTP option must be sms or email address"
            }),
    })
})

const forgetPasswordOTPVerifyValidationSchema = z.object({
    body: z.object({
        identifier: z
            .string({
                invalid_type_error: 'Identifier must be a string',
                required_error: 'Identifier is required'
            })
            .refine(value => {
                // Check if input matches email format or phone number format
                return /^\+(?:[0-9] ?){6,14}[0-9]$/.test(value) || z.string().email().safeParse(value).success;
            }, {
                message: 'Identifier must be a valid email or phone number'
            }),
        otp: z
            .string({
                invalid_type_error: 'OTP must be string',
                required_error: 'OTP is required'
            }),
        otp_option: z.
            enum(['sms', 'email'], {
                invalid_type_error: "OTP option must be string",
                required_error: "OTP option must be sms or email address"
            }),
    })
})


export const OTPValidations = {
    sendOTPValidationSchema,
    forgetPasswordOTPVerifyValidationSchema
}