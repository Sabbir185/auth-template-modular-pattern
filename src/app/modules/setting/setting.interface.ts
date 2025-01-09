
export type TSetting = {
    site_name: string;
    email: string;
    phone: string;
    address: string;
    description: string;
    logo: string;
    currency_code: string;
    currency_symbol: string;
    client_side_url: string;
    otp_verification_type: "email" | "phone";
    footer: string;
    CallBackUrl: string;
    ErrorUrl: string;
    CurrencyIso: string;
    map_key: string;
    app_version: {
        android?: number;
        ios: number;
    };
    email_config: {
        default: string;
        sendgrid: {
            host: string;
            port: string;
            username: string;
            password: string;
            sender_email: string;
        },
        gmail: {
            auth_email: string;
            password: string;
            service_provider: string;
        };
    };
    sms: {
        twilio_auth_token: string;
        twilio_sender_number: string;
        twilio_account_sid: string;
        active: boolean;
    };
};