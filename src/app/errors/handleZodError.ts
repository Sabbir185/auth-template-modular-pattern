import { ZodError, ZodIssue } from "zod";
import { TArrayOfErrorSources, TGenericErrorResponse } from "../interface/error";


const handleZodError = (err: ZodError): TGenericErrorResponse => {
    let errorsMessage: string = '';
    const statusCode = 400;

    const errorSources: TArrayOfErrorSources = err.issues.map((issue: ZodIssue) => {
        return {
            path: issue?.path[issue.path.length - 1],
            message: issue.message
        };
    });

    errorSources.forEach((el, ind) => {
        errorsMessage += el.message + (errorSources?.length - 1 === ind ? '.' : '. ')
    })

    return {
        statusCode,
        message: 'Validation Error',
        errorMessage: errorsMessage,
        errorDetails: err,
    };
};

export default handleZodError;