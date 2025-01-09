import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AuthService } from './auth.service';
import config from "../../config";
import { UserService } from '../user/user.service';
import AppError from '../../errors/AppError';
import { createToken, validEmailCheck, verifyToken } from './auth.utils';
import { User } from '../user/user.model';
import bcrypt from 'bcrypt';
import Config from '../../config';
import OTP from '../otp/otp.model';
import { generateOTP } from '../otp/otp.utils';
import { sendUserEmailGeneral } from '../../utils/sendEmail';
import { OTPService } from '../otp/otp.service';
import { SettingService } from '../setting/setting.service';
import dayjs from 'dayjs';
import { HttpStatusCode } from 'axios';


export class AuthController {
    static checkUserIdentifier = catchAsync(async (req, res) => {
        const { body } = req;
        const validationResult = validEmailCheck(body.identifier);
        let user: any = null;
        if (validationResult.success) {
            user = await UserService.findUserByEmail(body.identifier);
        } else {
            user = await UserService.findUserByPhoneNumber(body.identifier);
        }
        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Data fetched successfully',
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
            }
        })
    })

    static loginAccess = catchAsync(async (req, res) => {
        const { fcm_token, identifier, password } = req.body;
        const validationResult = validEmailCheck(identifier);
        let user: any = null;
        if (validationResult.success) {
            user = await UserService.findUserByEmail(identifier);
        } else {
            user = await UserService.findUserByPhoneNumber(identifier);
        }
        if (user.isDeleted === true) {
            throw new AppError(
                httpStatus.NOT_FOUND,
                "Failed to login",
                "User does not exists!"
            )
        }
        if(user.is_deleted === true) {
            throw new AppError(404, 'Request failed', 'User not exists!');
        }
        const isPasswordMatched = await bcrypt.compare(password as string, user.password)
        if (!isPasswordMatched) {
            throw new AppError(
                httpStatus.BAD_REQUEST,
                "Bad Request",
                "Invalid login credentials!"
            )
        }
        const tokenPayload = {
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role
        }
        const accessToken = createToken(
            tokenPayload,
            config.jwt_access_secret as string,
            config.jwt_access_expires_in as string
        )
        const refreshToken = createToken(
            tokenPayload,
            config.jwt_refresh_secret as string,
            config.jwt_refresh_expires_in as string
        )
        // fcm token add or update
        if(fcm_token) {
            // update fcm token
            const user_fcm_token = [...user.fcm_token || []];
            if(user_fcm_token?.length >= 2) {
                user_fcm_token.shift();
                user_fcm_token.push(fcm_token);
                await User.findByIdAndUpdate(user?._id, {$set: {fcm_token: user_fcm_token}})
            } else {
                await User.findByIdAndUpdate(user?._id, {$addToSet: {fcm_token: fcm_token}})
            }
        }
        res.cookie('refreshToken', refreshToken, {
            secure: config.node_env === 'prod',
            httpOnly: true
        })
        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'User logged in successfully',
            data: {
                user: {
                    _id: user?._id,
                    name: user?.name,
                    email: user?.email,
                    phone: user?.phone,
                    role: user?.role,
                },
                accessToken,
                refreshToken,
            }
        })
    })

    static refreshToken = catchAsync(async (req, res) => {
        const { refreshToken } = req.cookies;
        const decoded = verifyToken(refreshToken, config.jwt_refresh_secret as string);
        const { _id } = decoded;
        const user = await UserService.findUserById(_id);
        const tokenPayload: any = {
            _id: user?._id,
            name: user?.name,
            email: user?.email,
            phone: user?.phone,
            role: user?.role,
        }
        const accessToken = createToken(
            tokenPayload,
            config.jwt_access_secret as string,
            config.jwt_access_expires_in as string
        )
        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'AccessToken generated Successfully',
            data: { accessToken }
        })
    })

    static forgetPasswordOTPSend = catchAsync(async (req, res) => {
        const { identifier, action } = req.body;
        const validationResult = validEmailCheck(identifier?.trim());
        const setting = await SettingService.getSettingsBySelect("otp_verification_type");
        if (!validationResult.success && setting.otp_verification_type === 'email') {
            throw new AppError(400, 'Request Failed', 'Invalid email address');
        }
        if (validationResult.success) {
            await UserService.findUserByEmail(identifier);
        } else {
            await UserService.findUserByPhoneNumber(identifier);
        }
        const actions = ['signup'];
        if (actions?.includes(action)) {
            throw new AppError(400, 'Request Failed', 'Invalid action type!');
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

    static forgetPasswordOTPVerify = catchAsync(async (req, res) => {
        const { identifier, action, otp: otp_code } = req.body;
        const setting = await SettingService.getSettingsBySelect("otp_verification_type");
        let otp, user: any = null;
        const validationResult = validEmailCheck(identifier?.trim());
        if (!validationResult.success && setting.otp_verification_type === 'email') {
            throw new AppError(400, 'Request Failed', 'Invalid email address');
        }
        if (setting.otp_verification_type === 'email') {
            otp = await OTPService.findOtpByEmail({ email: identifier, otp: otp_code, action });
            user = await UserService.findUserByEmail(identifier);
        } else {
            otp = await OTPService.findOtpByPhone({ phone: identifier, otp: otp_code, action });
            user = await UserService.findUserByPhoneNumber(identifier);
        }
        if (!otp) {
            throw new AppError(400, 'Failed to verify OTP', 'Invalid or expired the OTP!');
        }
        // check 3 min expiration time
        const startTime = dayjs(otp.createdAt)
        const endTime = dayjs(Date.now())
        const expireTimesInMinute = endTime.diff(startTime, "minute");
        if (expireTimesInMinute >= 3) {
            throw new AppError(400, 'Invalid request', 'OTP expired! Please try again.');
        }
        if (otp && otp?.attempts > 0 && otp_code === otp?.code) {
            const tokenPayload: any = {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role
            };
            const accessToken = createToken(
                tokenPayload,
                config.jwt_access_secret as string,
                config.jwt_access_expires_in as string
            )
            sendResponse(res, {
                statusCode: httpStatus.OK,
                success: true,
                message: `OTP verified Successfully`,
                data: {
                    phone: validationResult.success ? undefined : identifier,
                    email: validationResult.success ? identifier : undefined,
                    accessToken
                }
            })
            return;
        }
        if (otp) {
            otp.attempts -= 1
            await otp.save()
        }
        throw new AppError(HttpStatusCode.BadRequest, 'Request Failed', 'Invalid OTP! Please try again.');
    })

    static forgetPasswordSubmitTokenBased = catchAsync(async (req, res) => {
        const { body } = req;
        const { _id } = res.locals.user
        await AuthService.forgetPasswordTokenBasedSubmitIntoDB(body, _id)
        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Password updated Successfully',
            data: null
        })
    })

    static userPasswordUpdate = catchAsync(async (req, res) => {
        const { body } = req;
        const { _id, password } = res.locals.user
        if(!(await bcrypt.compare(body.old_password, password))) {
            throw new AppError(HttpStatusCode.BadRequest, 'Request Failed', 'Password not matched! Please try again.');
        }
        await AuthService.forgetPasswordTokenBasedSubmitIntoDB(body, _id)
        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Password updated Successfully',
            data: undefined
        })
    })
}