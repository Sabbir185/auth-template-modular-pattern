import { catchAsync } from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { createToken } from '../auth/auth.utils';
import config from '../../config';
import dayjs from 'dayjs';
import AppError from '../../errors/AppError';
import { UserService } from './user.service';
import { HttpStatusCode } from 'axios';
import { SettingService } from '../setting/setting.service';
import { OTPService } from '../otp/otp.service';

export class UserController {
    static registerNewAccount = catchAsync(async (req, res) => {
        const { body } = req;
        const setting = await SettingService.getSettingsBySelect("otp_verification_type");
        let otp, user = null;
        if (setting.otp_verification_type === 'email') {
            otp = await OTPService.findOtpByEmail({ email: body.email, otp: body.otp, action: 'signup', errorMsg: false });
            user = await UserService.findUserByEmail(body.email, false);
        } else {
            otp = await OTPService.findOtpByPhone({ phone: body.phone, otp: body.otp, action: 'signup', errorMsg: false });
            user = await UserService.findUserByPhoneNumber(body.phone, false);
        }
        if (!otp) {
            throw new AppError(400, 'Failed to verify OTP', 'Invalid or expired the OTP!');
        }
        // check 3 min expiration time
        const startTime = dayjs(otp.createdAt);
        const endTime = dayjs(Date.now());
        const expireTimesInMinute = endTime.diff(startTime, 'minute');
        if (expireTimesInMinute >= 3) {
            throw new AppError(400, 'Invalid request', 'OTP expired! Please try again.');
        }
        if (otp && otp?.attempts > 0 && body.otp === otp?.code) {
            if (user) {
                throw new AppError(
                    409,
                    'Failed to create account',
                    'User already exists with this email or phone number!'
                );
            }
            if(body?.role === "admin") {
                throw new AppError(400, 'Request failed', 'Invalid role!');
            }
            body.is_verified = true;
            const newUser = await UserService.createNewUser(body);
            const tokenPayload: any = {
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                phone: newUser.phone,
                role: newUser.role
            };
            const accessToken = createToken(
                tokenPayload,
                config.jwt_access_secret as string,
                config.jwt_access_expires_in as string
            );
            sendResponse(res, {
                statusCode: httpStatus.CREATED,
                success: true,
                message: 'Registration successful',
                data: { accessToken }
            });
            return;
        }
        if (otp) {
            otp.attempts -= 1;
            await otp.save();
        }
        throw new AppError(HttpStatusCode.BadRequest, 'Request Failed', 'Invalid OTP! Please try again.');
    });

    static getUserProfile = catchAsync(async (req, res) => {
        const { user } = res.locals;
        sendResponse(res, {
            statusCode: httpStatus.CREATED,
            success: true,
            message: 'Data fetched successfully',
            data: {
                ...user,
                password: undefined,
                __v: undefined,
                is_deleted: undefined,
                fcm_token: undefined,
            }
        });
    })

    static userProfileUpdate = catchAsync(async (req, res) => {
        const { _id } = res.locals.user;
        const { body } = req;
        const updateQuery = { _id };
        const updateDocument = {
            $set: {
                ...body,
                _id: undefined,
                role: undefined,
                password: undefined,
                is_verified: undefined,
            }
        }
        const user = await UserService.updateUserProfile({query: updateQuery, updateDocument});
        sendResponse(res, {
            statusCode: httpStatus.CREATED,
            success: true,
            message: 'Profile updated successfully',
            data: {
                ...user,
                password: undefined,
                __v: undefined,
                is_deleted: undefined,
                fcm_token: undefined,
            }
        });
    })

    static userProfileDelete = catchAsync(async (req, res) => {
        const { user } = res.locals;
        if(user.is_deleted === true) {
            throw new AppError(404, 'Request failed', 'User not exists!');
        }
        await UserService.deleteUserFromDB(user._id);
        sendResponse(res, {
            statusCode: httpStatus.CREATED,
            success: true,
            message: 'Account deleted successfully',
            data: undefined
        });
    })
}