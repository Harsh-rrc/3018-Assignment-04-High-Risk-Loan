// Standardized success response format
export const successResponse = (data: any, message: string = "Success") => ({
    success: true,
    data,
    message,
    timestamp: new Date().toISOString()
});
 
// Standardized error response format
export const errorResponse = (message: string, code: string) => ({
    success: false,
    error: {
        message,
        code,
    },
    timestamp: new Date().toISOString(),
});