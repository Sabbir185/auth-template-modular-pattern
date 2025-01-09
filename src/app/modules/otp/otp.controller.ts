import { catchAsync } from '../../utils/catchAsync';
import { validEmailCheck } from '../auth/auth.utils';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import config from '../../config';
import { SettingService } from '../setting/setting.service';
import { OTPService } from './otp.service';
import { generateOTP } from './otp.utils';
import Config from '../../config';
import { sendUserEmailGeneral } from '../../utils/sendEmail';
import OTP from './otp.model';

export class OTPController {
    static sendOTP = catchAsync(async (req, res) => {
        const { identifier, action } = req.body;
        const validationResult = validEmailCheck(identifier?.trim());
        const setting = await SettingService.getSettingsBySelect("otp_verification_type");
        if (!validationResult.success && setting.otp_verification_type === 'email') {
            throw new AppError(400, 'Request Failed', 'Invalid email address');
        }
        const otpPayload = {
            email: validationResult.success ? identifier?.toLowerCase().trim() : undefined,
            phone: validationResult.success ? undefined : identifier?.trim(),
            action: action
        }
        const isAlreadySend = await OTPService.findOneByPayQuery(otpPayload, false);
        if (isAlreadySend) {
            throw new AppError(400, 'Invalid request', 'OTP already sent! Please try after 3 minutes.');
        }
        const otp = generateOTP(6);
        const settings: any = await SettingService.getSettings();
        if(settings.otp_verification_type === 'email') {
            const data = {
                email: identifier?.toLowerCase().trim() as string,
                subject: `${Config.website_name ? Config.website_name+": " : ''}OTP verification code`,
                message: `<h3>Your verification OTP code is: </h3>
                       <div style="background-color: azure; margin: 01px 0px; padding: 5px">
                           <h3 style="margin-left: 5px; letter-spacing: 3px;">
                            ${otp}
                            </h3>
                       </div>
                       <h3>For any kind of help, please contact our support team.</h3>
                       Sincerely,
                       <br/>
                       ${config.website_name} | Contact No. ${settings?.phone}
                    `,
            }
            await sendUserEmailGeneral(data)
            await OTP.create({
                email: identifier?.toLowerCase().trim(),
                code: otp,
                action: action
            })
        } else {
            // send sms
        }
        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: `The verification OTP was sent to your ${validationResult.success ? 'email address.' : 'phone number.'}`,
            data: { type: validationResult.success ? 'email' : 'phone', identifier: identifier.trim() }
        })
    })
}