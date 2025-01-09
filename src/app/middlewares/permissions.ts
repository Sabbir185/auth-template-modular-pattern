/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../utils/catchAsync"
import httpStatus from "http-status";


const hasPermission = (permission: string) => {
    return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { user } = res.locals; 
        if (user?.role === "admin") {
            next();
        } else if (user?.role === "employee" && user?.permissions) {
            const { permissions } = user?.permissions || {};
            if(permission && !permissions.includes(permission)) {
                return res.status(httpStatus.UNAUTHORIZED).json(
                    {
                        success: false,
                        message: "Unauthorized Access",
                        errorMessage: "You do not have the necessary permissions to access this resource.",
                        errorDetails: null,
                        stack: null
                    }
                )
            }
            next();
        } else {
            return res.status(httpStatus.UNAUTHORIZED).json(
                {
                    success: false,
                    message: "Unauthorized Access",
                    errorMessage: "You do not have the necessary permissions to access this resource.",
                    errorDetails: null,
                    stack: null
                }
            )
        }
    })
}

export default hasPermission;