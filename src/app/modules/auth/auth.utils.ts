import jwt, { JwtPayload } from 'jsonwebtoken';
import { TPayload } from './auth.interface';
import { z } from 'zod';
import { TUser } from '../user/user.interface';

export const getUserCurrentRole = (user: TUser) => {
    if(user?.role === "admin" || user?.role === 'employee') {
        return user?.role;
    }
    return user?.current_role || user?.role;
}

export const createToken = (payload: TPayload, secret: string, expiresIn: string) => {
    return jwt.sign(payload, secret, {expiresIn})
}

export const verifyToken = (token: string, secret: string) => {
    return jwt.verify(token, secret) as JwtPayload
}

export const validEmailCheck = (email: string) => {
    const emailSchema = z.string().email();
    return emailSchema.safeParse(email);
}