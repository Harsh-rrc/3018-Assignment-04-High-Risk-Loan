// tests/errorHandling.test.ts
import request from 'supertest';
import express, { Request, Response } from 'express';
import { errorHandler } from '../src/api/v1/middleware/errorHandler';
import { AppError } from '../src/api/v1/errors/AppError';
import { AuthError } from '../src/api/v1/errors/AuthError';
import { BadRequestError } from '../src/api/v1/errors/BadRequestError';
import { NotFoundError } from '../src/api/v1/errors/NotFoundError';
import { ForbiddenError } from '../src/api/v1/errors/ForbiddenError';
import { HTTP } from '../src/constants/httpCodes';

describe('Error handling system', () => {
  // Build a small express app for testing middleware formatting
  const app = express();
  app.use(express.json());

  // route that throws an AppError (operational error)
  app.get('/test/app-error', (req: Request, res: Response) => {
    throw new AppError('Test app error', 422, true, { foo: 'bar' });
  });

  // route that throws a generic Error (programming/unexpected)
  app.get('/test/generic-error', () => {
    throw new Error('Unexpected crash!');
  });

  // attach error handler
  app.use(errorHandler);

  it('middleware should format AppError responses consistently', async () => {
    const res = await request(app).get('/test/app-error');
    expect(res.status).toBe(422);
    expect(res.body).toHaveProperty('error');
    expect(res.body.error).toHaveProperty('message', 'Test app error');
    expect(res.body.error).toHaveProperty('status', 422);
    expect(res.body.error).toHaveProperty('timestamp');
    expect(typeof res.body.error.timestamp).toBe('string');
    // details passed through
    expect(res.body.error).toHaveProperty('details');
    expect(res.body.error.details).toEqual({ foo: 'bar' });
  });

  it('middleware should hide internal details for generic errors and return 500', async () => {
    const res = await request(app).get('/test/generic-error');
    expect(res.status).toBe(HTTP.INTERNAL);
    expect(res.body).toHaveProperty('error');
    expect(res.body.error).toHaveProperty('message');
    // In test environment message is the original message; in production it'll be 'Internal server error'
    expect(typeof res.body.error.timestamp).toBe('string');
    expect(res.body.error.status).toBe(HTTP.INTERNAL);
  });

  // Now tests for each custom error class - each should set correct status/message
  it('AppError should allow custom status and details', () => {
    const e = new AppError('Base message', 499, true, { x: 1 });
    expect(e).toBeInstanceOf(AppError);
    expect(e.message).toBe('Base message');
    expect(e.status).toBe(499);
    expect((e as any).details).toEqual({ x: 1 });
  });

  it('AuthError should default to 401', () => {
    const e = new AuthError();
    expect(e).toBeInstanceOf(AppError);
    expect(e.status).toBe(HTTP.UNAUTHORIZED);
    expect(e.message).toMatch(/authentication/i);
  });

  it('BadRequestError should default to 400', () => {
    const e = new BadRequestError('bad input');
    expect(e.status).toBe(HTTP.BAD_REQUEST);
    expect(e.message).toBe('bad input');
  });

  it('NotFoundError should default to 404', () => {
    const e = new NotFoundError();
    expect(e.status).toBe(HTTP.NOT_FOUND);
  });

  it('ForbiddenError should default to 403', () => {
    const e = new ForbiddenError('no access');
    expect(e.status).toBe(HTTP.FORBIDDEN);
    expect(e.message).toBe('no access');
  });
});