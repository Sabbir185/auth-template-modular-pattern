/* eslint-disable @typescript-eslint/ban-ts-comment */
import mongoose from "mongoose";
import { TArrayOfErrorSources, TGenericErrorResponse } from "../interface/error";


const handleCastError = (err: mongoose.Error.ValidatorError | mongoose.Error.CastError | unknown): TGenericErrorResponse => {
    let errorsMessage: string = '';
    const statusCode = 400;

    // @ts-ignore
    const errorSources: TArrayOfErrorSources = Object.values(err?.errors).map(
        (val: mongoose.Error.ValidatorError | mongoose.Error.CastError | unknown) => {
            return {
                // @ts-ignore
                path: val?.path,
                // @ts-ignore
                message: val?.message
            };
        });

    errorSources.forEach((el, ind) => {
        errorsMessage += el.message.toString() + (errorSources?.length - 1 === ind ? '.' : '. ')
    })

    return {
        statusCode,
        message: 'Invalid Cast Error',
        errorMessage: errorsMessage,
        // @ts-ignore
        errorDetails: err?.errors,
    };
};

export default handleCastError;