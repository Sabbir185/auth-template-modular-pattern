import { model, Schema } from 'mongoose'
import { TSetting } from './setting.interface'

const schema = new Schema<TSetting>(
    {
        site_name: String,
        email: String,
        phone: String,
        footer: String,
        address: String,
        description: String,
        logo: String,
        currency_code: String,
        currency_symbol: String,
        CurrencyIso: String,
        otp_verification_type: {
            type: String,
            enum: {
                values: ['email', 'phone'],
                message: '{VALUE} is not a valid otp verification type'
            },
            default: 'email',
        },
        app_version: {
            android: {
                driver: Number,
                user: Number
            },
            ios: {
                driver: String,
                user: String
            },
        },
        email_config: {
            default: String,
            sendgrid: {
                host: String,
                port: String,
                username: String,
                password: String,
                sender_email: String,
            },
            gmail: {
                auth_email: String,
                password: String,
                service_provider: String,
            },
        },
        sms: {
            twilio_auth_token: String,
            twilio_sender_number: String,
            twilio_account_sid: String,
            active: {
                type: Boolean,
                default: false
            },
        },

    },
    {
        timestamps: true
    }
)

const Settings = model<TSetting>('Settings', schema)
export default Settings
