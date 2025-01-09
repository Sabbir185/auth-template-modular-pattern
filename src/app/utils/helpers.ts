import crypto from 'crypto';
import mongoose, { Types } from 'mongoose';
import AppError from '../errors/AppError';

/* eslint-disable @typescript-eslint/no-explicit-any */
export const numberGen = (length: number = 4) => {
    let str = ''
    for (let i = 0; i < length; i++) {
        str += Math.floor(Math.random() * 10)
    }
    return str
}


export const generateUid = async (prefix: any, model: any, len: number=8): Promise<any> => {
    const randomUID = crypto.randomBytes(2).toString("hex");
    const randomString = prefix + randomUID + String.fromCharCode(...randomNumberGenerator(len, 32));
    const uidExists = await model.findOne({
        uid: randomString
    });
    if (uidExists) {
        console.error('Matched!', randomString);
        return await generateUid(prefix, model);
    }
    return randomString;
};

export const generateTransactionId = async (prefix: any, model: any, tran_id?: boolean): Promise<any> => {
    const randomUID = crypto.randomBytes(2).toString("hex");
    const randomString = prefix + randomUID + String.fromCharCode(...randomNumberGenerator(6, 32));
    let transExists: any;
    if(tran_id) {
        transExists = await model.findOne({
            tran_id: randomString
        });
    } else {
        transExists = await model.findOne({
            transaction_id: randomString
        });
    }
    if (transExists) {
        console.error('Matched!', randomString);
        if(tran_id) {
            return await generateTransactionId(prefix, model, true);

        } else {
            return await generateTransactionId(prefix, model);
        }
    }
    return randomString;
};

export const generateID = (prefix: any, length = 8) => {
    return prefix + String.fromCharCode(...randomNumberGenerator(length, 32));
}

export const generateUserName = (input: string) => {
    return input.toLowerCase().replace(/\s+/g, '-').replace(/\./g, '');
}


const dictionary = [
    49, //1
    50, //2
    51, //3
    52, //4
    53, //5
    54, //6
    56, //7
    55, //8
    57, //9
    65, //A
    66, //B
    67, //C
    68, //D
    69, //E
    70, //F
    71, //G
    72, //H
    74, //J
    75, //K
    76, //L
    77, //M
    78, //N
    80, //P
    81, //Q
    82, //R
    83, //S
    84, //T
    85, //U
    86, //V
    87, //W
    88, //X
    89, //Y
    90 //Z
];
const randomNumberGenerator = (length: any, max: any) => {
    const randomNumber = [];
    for (let index = 0; index < length; index++) {
        // 49-57 and 65-78 and 80-90
        randomNumber.push(dictionary[Math.round(Math.random() * max)]);
    }
    return randomNumber;
};

export const isObjectEmpty = (objectName: any) => {
    return Object.keys(objectName).length === 0
}

export function keyValuePairToObject(arr: any) {
    const decode: any = {}
    for (let i = 0; i < arr.length; i++) {
        decode[arr[i].key] = arr[i].value
    }
    return decode;
}

export function objectToKeyValuePair(obj: any) {
    const details: any = [];
    const keys = Object.keys(obj);
    const values = Object.values(obj);
    for (let i = 0; i < keys.length; i++) {
        details.push(
            {
                key: keys[i],
                value: values[i],
            }
        )
    }
    return details;
}

export const capitalizeFirstLetter = (string: string) => {
    return string?.charAt(0).toUpperCase() + string?.slice(1);
}

export function checkIdValidOrNot(id: string|Types.ObjectId) {
    try {
        new mongoose.Types.ObjectId(id?.toString())
    } catch (error) {
        throw new AppError(
            404,
            'Request failed',
            'The given _id not valid!',
        );
    }
}