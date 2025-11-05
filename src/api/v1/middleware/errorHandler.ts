import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/errors";
import { HTTP_STATUS } from "../../../constants/httpConstants";
import { errorResponse } from "../models/responseModel";

// Centralized error handling middleware
const errorHandler = (
    err: Error | null,
    req: Request,
    res: Response,
    _next: NextFunction
): void => {
    if (!err) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(
            errorResponse("An unexpected error occurred", "UNKNOWN_ERROR")
        );
        return;
    }

    if (err instanceof AppError) {
        // Handle our custom application errors with their specific status codes
        res.status(err.statusCode).json(errorResponse(err.message, err.code));
    } else {
        // For unknown errors, respond with a generic message
        const message = process.env.NODE_ENV === "production"
            ? "An unexpected error occurred"
            : err.message;

        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(
            errorResponse(message, "UNKNOWN_ERROR")
        );
    }
};

export default errorHandler;