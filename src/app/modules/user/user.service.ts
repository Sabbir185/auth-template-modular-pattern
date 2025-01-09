import { User } from './user.model';
import AppError from '../../errors/AppError';
import { HttpStatusCode } from 'axios';
import { Types } from 'mongoose';
import { IUserUpdateParameters } from './user.interface';

export class UserService {
    static async createNewUser(payload: any) {
        const newUser = await User.create({
            name: payload.name,
            email: payload.email,
            phone: payload.phone,
            password: payload.password,
            role: payload.role,
            fcm_token: payload.fcm_token,
        })
        if (!newUser) {
            throw new AppError(HttpStatusCode.BadRequest, 'Request Failed', 'Failed to create account! Please try again.');
        }
        return newUser;
    }

    static async findUserById(_id: string|Types.ObjectId) {
        const user = await User.findById(_id).lean();
        if (!user) {
            throw new AppError(HttpStatusCode.NotFound, 'Request Failed', 'User not found!');
        }
        return user;
    }

    static async findUserByPhoneNumber(phone: string, errorMsg: boolean = true) {
        const user = await User.findOne({ phone }).lean();
        if (!user && errorMsg) {
            throw new AppError(HttpStatusCode.NotFound, 'Request Failed', 'User not found!');
        }
        return user;
    }

    static async findUserByEmail(email: string, errorMsg: boolean = true) {
        const user = await User.findOne({ email: email?.trim().toLowerCase() }).lean();
        if (!user && errorMsg) {
            throw new AppError(HttpStatusCode.NotFound, 'Request Failed', 'User not found!');
        }
        return user;
    }

    static async updateUserProfile({query,updateDocument,session=undefined}:IUserUpdateParameters) {
        const options = {
            new: true,
            session
        }
        const updatedUser = await User.findOneAndUpdate(
            query,
            updateDocument,
            options
        ).lean();
        return updatedUser;
    }

    static async deleteUserFromDB(_id: string|Types.ObjectId) {
        const user = await User.findByIdAndUpdate(_id, { is_deleted: true }).lean();
        if (!user) {
            throw new AppError(HttpStatusCode.NotFound, 'Request Failed', 'User not found!');
        }
        return user;
    }
}
