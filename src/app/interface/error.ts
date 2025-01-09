export type TErrorSources = {
    path: string | number | undefined;
    message: string;
}

export type TArrayOfErrorSources = {
    path: string | number | undefined;
    message: string;
}[]

export type TGenericErrorResponse = {
    statusCode: number;
    message: string;
    errorMessage?: string;
    errorDetails?: unknown;
    errorSources?: TErrorSources
}