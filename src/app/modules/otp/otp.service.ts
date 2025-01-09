import AppError from '../../errors/AppError';
import { HttpStatusCode } from 'axios';
import OTP from './otp.model';

export class OTPService {
    static async findOtpByEmail({ email, otp, action, errorMsg = true }: {
        email: string,
        otp: string,
        action: string,
        errorMsg?: boolean
    }) {
        const otp_data = await OTP.findOne({ email: email.trim().toLowerCase(), code: otp, action });
        if (!otp_data && errorMsg) {
            throw new AppError(HttpStatusCode.NotFound, 'Request Failed', 'Invalid or Expired OTP!');
        }
        return otp_data;
    }

    static async findOtpByPhone({ phone, otp, action, errorMsg = true }: {
        phone: string,
        otp: string,
        action: string,
        errorMsg?: boolean
    }) {
        const otp_data = await OTP.findOne({ phone: phone.trim(), code: otp, action });
        if (!otp_data && errorMsg) {
            throw new AppError(HttpStatusCode.NotFound, 'Request Failed', 'Invalid or Expired OTP!');
        }
        return otp_data;
    }

    static async findOneByPayQuery(queries: any, errorMsg: boolean = true) {
        const otp_data = await OTP.findOne(queries);
        if (!otp_data && errorMsg) {
            throw new AppError(HttpStatusCode.NotFound, 'Request Failed', 'Invalid or Expired OTP!');
        }
        return otp_data;
    }
}
