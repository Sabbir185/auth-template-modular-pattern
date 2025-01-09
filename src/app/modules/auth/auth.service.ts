import httpStatus from 'http-status';
import { User } from '../user/user.model';
import AppError from '../../errors/AppError';
import config from '../../config';
import { TForgetPassword } from './auth.interface';
import bcrypt from 'bcrypt';

export class AuthService {
    static async forgetPasswordTokenBasedSubmitIntoDB(payload: TForgetPassword, _id: string) {
        if (payload.password !== payload.confirm_password) {
            throw new AppError(
                httpStatus.BAD_REQUEST,
                'Bad request',
                'Password and confirm password does not match!'
            );
        }
        const hashedPassword = await bcrypt.hash(payload.password as string, Number(config.bcrypt_salt_rounds));
        await User.findByIdAndUpdate(_id, { $set: { password: hashedPassword } });
    }
}