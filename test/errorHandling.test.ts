import { Request, Response, NextFunction } from "express";
import errorHandler from '../src/api/v1/middleware/errorHandler';
import { AuthorizationError, AuthenticationError } from '../src/api/v1/errors/errors';

// Unit tests for error handler middleware
describe('Error Handler Middleware', () => {
  let mockNext: jest.MockedFunction<NextFunction>;
  let mockRes: Partial<Response>;
  let mockReq: Partial<Request>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockNext = jest.fn();
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    mockReq = {};
  });

  test('handles AuthorizationError correctly', () => {
    const error = new AuthorizationError("Forbidden");
    errorHandler(error, mockReq as Request, mockRes as Response, mockNext);
    expect(mockRes.status).toHaveBeenCalledWith(403);
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        error: {
          message: "Forbidden",
          code: "AUTHORIZATION_ERROR",
        },
      })
    );
  });

  test('handles AuthenticationError correctly', () => {
    const error = new AuthenticationError("Unauthorized", "TOKEN_INVALID");
    errorHandler(error, mockReq as Request, mockRes as Response, mockNext);
    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        error: {
          message: "Unauthorized",
          code: "TOKEN_INVALID",
        },
      })
    );
  });

  test('handles generic Error correctly', () => {
    const error = new Error("Something went wrong");
    errorHandler(error, mockReq as Request, mockRes as Response, mockNext);
    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        error: {
          message: "Something went wrong",
          code: "UNKNOWN_ERROR",
        },
      })
    );
  });

  test('handles null error correctly', () => {
    const error = null;
    errorHandler(error, mockReq as Request, mockRes as Response, mockNext);
    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        error: {
          message: "An unexpected error occurred",
          code: "UNKNOWN_ERROR",
        },
      })
    );
  });
});