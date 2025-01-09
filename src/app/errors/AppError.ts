class AppError extends Error {
    public statusCode: number;
    public errorMessage: string;
    constructor(statusCode: number, message: string, errorMessage: string, stack='') {
        super(errorMessage);
        this.statusCode = statusCode;
        this.errorMessage = message;
        if (stack) {
            this.stack = stack
        } else {
            Error.captureStackTrace(this, this.constructor)
        }
    }
}

export default AppError;