// src/api/v1/errors/errors.ts
import { HTTP_STATUS } from "../../../constants/httpConstants";
 
// Base application error class
export abstract class AppError extends Error {
    constructor(
        public message: string,
        public code: string,
        public statusCode: number
    ) {
        super(message);
        this.name = this.constructor.name;
        Object.setPrototypeOf(this, new.target.prototype);
        Error.captureStackTrace(this, this.constructor);
    }
}
 
// Repository layer error
export class RepositoryError extends AppError {
    constructor(
        message: string,
        code: string = "REPOSITORY_ERROR",
        statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR
    ) {
        super(message, code, statusCode);
    }
}
 
// Service layer error
export class ServiceError extends AppError {
    constructor(
        message: string,
        code: string = "SERVICE_ERROR",
        statusCode: number = HTTP_STATUS.BAD_REQUEST
    ) {
        super(message, code, statusCode);
    }
}
 
// Authentication error
export class AuthenticationError extends AppError {
    constructor(
        message: string,
        code: string = "AUTHENTICATION_ERROR",
        statusCode: number = HTTP_STATUS.UNAUTHORIZED
    ) {
        super(message, code, statusCode);
    }
}
 
// Authorization error
export class AuthorizationError extends AppError {
    constructor(
        message: string,
        code: string = "AUTHORIZATION_ERROR",
        statusCode: number = HTTP_STATUS.FORBIDDEN
    ) {
        super(message, code, statusCode);
    }
}
 
// Validation error
export class ValidationError extends AppError {
    constructor(
        message: string,
        code: string = "VALIDATION_ERROR",
        statusCode: number = HTTP_STATUS.UNPROCESSABLE_ENTITY
    ) {
        super(message, code, statusCode);
    }
}
 
// Not found error
export class NotFoundError extends AppError {
    constructor(
        message: string,
        code: string = "NOT_FOUND_ERROR",
        statusCode: number = HTTP_STATUS.NOT_FOUND
    ) {
        super(message, code, statusCode);
    }
}

// Internal server error
export class InternalServerError extends AppError {
    constructor(
        message: string,
        code: string = "INTERNAL_SERVER_ERROR",
        statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR
    ) {
        super(message, code, statusCode);
    }
}