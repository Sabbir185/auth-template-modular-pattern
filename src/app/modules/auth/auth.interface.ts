import { Types } from "mongoose";

export type TUserLogin = {
    identifier: string;
    password: string;
    fcm_token: string;
    role?: string;
};

export type TPayload = {
    _id?: Types.ObjectId | undefined;
    role?: string;
    email?: string;
    phone?: string;
    name?: string;
}

export type TForgetPassword = {
    password?: string;
    confirm_password?: string;
}