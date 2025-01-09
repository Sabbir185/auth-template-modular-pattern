import { Schema, model } from 'mongoose';
import { TUser, TUserQuery } from './user.interface';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import bcrypt from 'bcrypt';
import config from '../../config';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';

const userSchema = new Schema<TUser>(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            toLowerCase: true,
            trim: true,
            required: true
        },
        phone: {
            type: String,
            trim: true,
            required: true
        },
        image: String,
        password: {
            type: String,
            required: true
        },
        role: {
            type: String,
            enum: {
                values: [
                    'admin',
                    'employee',
                    'surgeon',
                    'doctor',
                    'coordinator',
                    'patient',
                    'nurse',
                    'technical_staff'
                ],
                message: '{VALUE} is not a valid role'
            },
            required: true
        },
        gender: {
            type: String,
            enum: {
                values: ['male', 'female', 'other'],
                message: '{VALUE} is not a valid gender'
            },
        },
        joining_date: String,
        city: String,
        address: String,
        is_deleted: {
            type: Boolean,
            default: false
        },
        is_verified: {
            type: Boolean,
            default: false
        },
        status: {
            type: String,
            enum: {
                values: ['pending', 'approved', 'cancelled', 'suspended'],
                message: '{VALUE} is not a valid status'
            },
            default: 'pending'
        },
        fcm_token: [String],
        permissions: {
            type: Schema.Types.ObjectId,
            ref: 'role_permission'
        }
    },
    {
        timestamps: true
    }
);


userSchema.pre('save', async function(next) {
    this.password = await bcrypt.hash(this.password, Number(config.bcrypt_salt_rounds));
    next();
});

userSchema.post('save', async function(doc, next) {
    doc.__v = undefined;
    next();
});

userSchema.statics.isPasswordMatched = async function(password: string, hashedPassword: string) {
    return await bcrypt.compare(password, hashedPassword);
};

userSchema.statics.isJWTIssuedBeforePasswordChanged = async function(passwordChangedTimestamp: Date, jwtIssuedTimestamp: number) {
    const passwordChangedTime = new Date(passwordChangedTimestamp).getTime() / 1000;
    return passwordChangedTime > jwtIssuedTimestamp;
};

userSchema.statics.isUserExists = async function({ _id, email, phone }: TUserQuery) {
    const user = await User.findOne({ $or: [{ email }, { phone }, { _id }] });
    if (!user) {
        throw new AppError(
            httpStatus.NOT_FOUND,
            'Invalid input',
            'User not found !'
        );
    }
    return user;
};

userSchema.plugin(aggregatePaginate);
export const User = model<TUser>('user', userSchema);