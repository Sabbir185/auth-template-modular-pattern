/* eslint-disable @typescript-eslint/no-explicit-any */
import { Types, Model } from "mongoose"
import { USER_ROLE } from "./user.constant";

export type TUser = {
    _id?: Types.ObjectId;
    name: string,
    email: string | undefined | null;
    phone: string | undefined | null;
    password: string;
    role: string;
    current_role: string;
    gender: string;
    is_deleted: boolean;
    is_verified: boolean;
    image: string;
    driving_license?: string;
    date_of_birth?: string;
    date_of_birth_hijri?: string;
    joining_date?: string;
    address?: string;
    is_active: boolean;
    position?: {
        lat: number;
        lng: number;
    };
    location?: {
        type: string;
        coordinates: number[];
    };
    status: 'pending' | 'approved' | 'cancelled' | 'suspended';
    fcm_token: [string];
    permissions: Types.ObjectId;
    city: string;
    dynamic_fields: [
        {
            key: string;
            value: [
                    string | boolean | number
            ];
            type: string;
        }
    ]
}

export type TUserQuery = {
    _id?: string | undefined;
    email?: string | undefined; 
    phone?: string | undefined;
}

export type TUserPasswordChange = {
    _id?: string;
    password?: string; 
    confirm_password?: string;
    current_password?: string;
}

export interface IUserUpdateParameters {
    query: Record<string, any>;
    updateDocument: any;
    session?: any;
}

export type TUserRole = keyof typeof USER_ROLE;