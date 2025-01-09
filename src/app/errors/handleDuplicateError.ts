/* eslint-disable @typescript-eslint/no-explicit-any */
import { TErrorSources, TGenericErrorResponse } from '../interface/error';

const handleDuplicateError = (err: any): TGenericErrorResponse => {
    const match = err.message.match(/"([^"]*)"/);
    const extractedMessage = match && match[1];

    const errorDetails: TErrorSources = {
        path: '',
        message: `${extractedMessage} is already exists`,
    }

    const statusCode = 400;

    return {
        statusCode,
        message: 'Duplicate error found',
        errorMessage: `${extractedMessage} is already exists`,
        errorDetails,
    };
};

export default handleDuplicateError;