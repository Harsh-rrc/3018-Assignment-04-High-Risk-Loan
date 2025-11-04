// Utility functions for error handling
export const getErrorMessage = (error: unknown): string => {
    if (error instanceof Error) {
        return error.message;
    }
    return String(error);
};
 
// Extracts error code from error
export const getErrorCode = (error: unknown): string => {
    if (error instanceof Error) {
 
        // Check if it's one of our custom AppErrors
        if ('code' in error && typeof (error as any).code === 'string') {
            return (error as any).code;
        }
 
        const firebaseError = error as any;
        return firebaseError.code || "UNKNOWN_ERROR";
    }
    return "UNKNOWN_ERROR";
};
 
// Extracts HTTP status code from error
export const getErrorStatusCode = (error: unknown): number => {
    if (error instanceof Error) {
        // Check if it's one of our custom AppErrors
        if ('statusCode' in error && typeof (error as any).statusCode === 'number') {
            return (error as any).statusCode;
        }
    }
    return 500;
};
 
// Checks if the error is an operational error (custom AppError)
export const isOperationalError = (error: unknown): boolean => {
    return error instanceof Error && 'statusCode' in error && 'code' in error;
};
 