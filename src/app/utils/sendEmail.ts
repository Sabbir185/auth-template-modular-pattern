import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import Settings from '../modules/setting/setting.model';
dotenv.config();

type TData = {
    email: string;
    subject: string;
    message: string;
}

export const sendUserEmailGeneral = async (data: TData) => {
    const settings: any = await Settings.findOne({}).select('email_config').lean();
    let transporter: any, from_email;

    if (settings?.email_config?.default === 'sendgrid') {
        transporter = nodemailer.createTransport({
            host: settings?.email_config?.sendgrid?.host,
            port: settings?.email_config?.sendgrid?.port,
            secure: false,
            auth: {
                user: settings?.email_config?.sendgrid?.sender_email,
                pass: settings?.email_config?.sendgrid?.password,
            },
        });
        from_email = settings?.email_config?.sendgrid?.sender_email

    } else if (settings?.email_config?.default === 'gmail') {
        transporter = nodemailer.createTransport({
            secure: false,
            service: settings?.email_config?.gmail?.service_provider,
            auth: {
                user: settings?.email_config?.gmail?.auth_email,
                pass: settings?.email_config?.gmail?.password,
            },
        });
        from_email = settings?.email_config?.gmail?.auth_email
    }

    return await transporter.sendMail({
        from: from_email,                // sender address
        to: data.email,                             // list of receivers
        subject: data.subject,              // Subject line
        html: data.message,   // html body
    })
};