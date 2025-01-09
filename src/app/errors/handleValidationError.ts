import { TArrayOfErrorSources, TGenericErrorResponse } from "../interface/error";
import mongoose from "mongoose";

const handleValidationError = (err: mongoose.Error.ValidationError): TGenericErrorResponse => {
    let errorsMessage: string = '';
    const statusCode = 400;

    const errorSources: TArrayOfErrorSources = Object.values(err.errors).map(
        (val: mongoose.Error.ValidatorError | mongoose.Error.CastError) => {
            return {
                path: val?.path,
                message: val?.message
            };
        });

    errorSources.forEach((el, ind) => {
        errorsMessage += el.message.toString() + (errorSources?.length - 1 === ind ? '.' : '. ')
    })

    return {
        statusCode,
        message: 'Validation error',
        errorMessage: errorsMessage,
        errorDetails: err.errors,
    };
};

export default handleValidationError;