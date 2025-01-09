export type TOtp = {
    phone: string;
    email: string;
    code: string;
    action: string;
    attempts: number;
    expireAt: Date;
    otp?: string;
    token?: string;
    otp_option?: string;
    identifier?: string;
    expired_time: Date;
    created_time: Date;
    createdAt: Date;
};