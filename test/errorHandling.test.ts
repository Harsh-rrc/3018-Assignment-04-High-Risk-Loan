import request from 'supertest';
import express from 'express';
import errorHandler from '../src/api/v1/middleware/errorHandler';
import * as Errors from '../src/api/v1/errors/errors';
const {
    RepositoryError,
    ServiceError,
    AuthenticationError,
    NotFoundError,
    InternalServerError
} = Errors;
import { errorResponse } from '../src/api/v1/models/responseModel';
 
describe('Error Handling Architecture', () => {
  let app: express.Application;
 
  beforeEach(() => {
    app = express();
  });
 
  describe('Custom Error Classes', () => {
    it('should create RepositoryError with correct status code', () => {
      const error = new RepositoryError('Invalid input');
      expect(error.statusCode).toBe(500);
      expect(error.message).toBe('Invalid input');
      expect(error.code).toBe('REPOSITORY_ERROR');
    });

    it('should create UnauthorizedError with correct status code', () => {
      const error = new AuthenticationError('Authentication required');
      expect(error.statusCode).toBe(401);
      expect(error.message).toBe('Authentication required');
      expect(error.code).toBe('AUTHENTICATION_ERROR');
    });

    it('should create ForbiddenError with correct status code', () => {
      const error = new ServiceError('Insufficient permissions');
      expect(error.statusCode).toBe(400);
      expect(error.message).toBe('Insufficient permissions');
      expect(error.code).toBe('SERVICE_ERROR');
    });

    it('should create NotFoundError with correct status code', () => {
      const error = new NotFoundError('Resource not found');
      expect(error.statusCode).toBe(404);
      expect(error.message).toBe('Resource not found');
      expect(error.code).toBe('NOT_FOUND_ERROR');
    });
 
    it('should create InternalServerError with correct status code', () => {
      const error = new InternalServerError('Server error');
      expect(error.statusCode).toBe(500);
      expect(error.message).toBe('Server error');
      expect(error.code).toBe('INTERNAL_SERVER_ERROR');
    });
  });
 
  describe('Error Handler Middleware', () => {
    it('should handle AppError instances with correct status code', async () => {
      app.get('/test-app-error', (req, res, next) => {
        next(new NotFoundError('Test resource not found'));
      });
      app.use(errorHandler);
 
      const response = await request(app).get('/test-app-error');
     
      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        success: false,
        error: {
          message: 'Test resource not found',
          code: 'NOT_FOUND_ERROR'
        },
        timestamp: expect.any(String)
      });
    });
 
    it('should handle generic Error instances with 500 status', async () => {
      app.get('/test-generic-error', (req, res, next) => {
        next(new Error('An unexpected error occurred'));
      });
      app.use(errorHandler);
 
      const response = await request(app).get('/test-generic-error');
     
      expect(response.status).toBe(500);
      expect(response.body.error.code).toBe('UNKNOWN_ERROR');
      expect(response.body.error.message).toBe('An unexpected error occurred');
    });
 
    it('should handle null/undefined errors gracefully', async () => {
      app.get('/test-null-error', (req, res, next) => {
        errorHandler(null, req, res, next);
      });

      const response = await request(app).get('/test-null-error');

      expect(response.status).toBe(500);
      expect(response.body.error.code).toBe('UNKNOWN_ERROR');
      expect(response.body.error.message).toBe('An unexpected error occurred');
    });
  });
 
  describe('Error Response Format', () => {
    it('should create standardized error response', () => {
      const response = errorResponse('Test error', 'TEST_ERROR');

      expect(response).toEqual({
        success: false,
        error: {
          message: 'Test error',
          code: 'TEST_ERROR'
        },
        timestamp: expect.any(String)
      });
    });
  });
});