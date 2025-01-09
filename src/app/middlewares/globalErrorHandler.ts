/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ErrorRequestHandler } from "express";
import config from "../config";
import { ZodError } from "zod";
import handleZodError from "../errors/handleZodError";
import handleValidationError from "../errors/handleValidationError";
import handleCastError from "../errors/handleCastError";
import handleDuplicateError from "../errors/handleDuplicateError";
import AppError from "../errors/AppError";
import httpStatus from "http-status";


const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
    let statusCode = 500;
    let message = "Something went wrong";
    let errorMessage = "Server side error";
    let errorDetails: unknown;

    if (err instanceof ZodError) {
        const simplifiedError = handleZodError(err);
        statusCode = simplifiedError?.statusCode;
        message = simplifiedError?.message;
        errorMessage = simplifiedError?.errorMessage as string;
        errorDetails = simplifiedError?.errorDetails;

    } else if (err?.name === 'ValidationError') {
        const simplifiedError = handleValidationError(err);
        statusCode = simplifiedError?.statusCode;
        message = simplifiedError?.message;
        errorMessage = simplifiedError?.errorMessage as string;
        errorDetails = simplifiedError?.errorDetails;

    } else if (err?.name === 'CastError') {
        const simplifiedError = handleCastError(err);
        statusCode = simplifiedError?.statusCode;
        message = simplifiedError?.message;
        errorMessage = simplifiedError?.errorMessage as string;
        errorDetails = simplifiedError?.errorDetails;

    } else if (err?.code === 11000) {
        const simplifiedError = handleDuplicateError(err);
        statusCode = simplifiedError?.statusCode;
        message = simplifiedError?.message;
        errorMessage = simplifiedError?.errorMessage as string;
        errorDetails = simplifiedError?.errorDetails;

    } else if (err instanceof AppError) {
        statusCode = err?.statusCode;
        message = err?.errorMessage;
        errorMessage = err?.message;
        errorDetails = err

    } else if (err?.name === 'TokenExpiredError') {
        return res.status(httpStatus.UNAUTHORIZED).json(
            {
                success: false,
                statusCode: 401,
                message: "Unauthorized Access",
                errorMessage: "You do not have the necessary permissions to access this resource.",
                errorDetails: null,
                stack: null
            }
        )

    } else if (err instanceof Error) {
        errorMessage = err?.message;
        errorDetails = err
    } 
    

    return res.status(statusCode).json({
        success: false,
        statusCode,
        message,
        errorMessage,
        errorDetails,
        stack: config.node_env === 'development' ? err?.stack : null,
    })
};

export default globalErrorHandler;