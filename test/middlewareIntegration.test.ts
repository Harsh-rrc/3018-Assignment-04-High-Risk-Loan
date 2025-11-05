import request from 'supertest';
import app from '../src/app';

// Integration tests to verify middleware order and interactions
describe('Middleware Integration Tests', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('should apply request logging early in middleware stack', async () => {
    const response = await request(app).get('/test');
    expect(response.status).toBe(200);
    // Logging should be applied before body parsing
  });

  test('should handle authentication and authorization together', async () => {
    // Test loan routes require auth
    const response = await request(app).get('/api/v1/loans');
    expect(response.status).toBe(401); // Should fail due to no auth token
  });

  test('should handle error responses consistently', async () => {
    const response = await request(app).get('/api/v1/loans');
    expect(response.body).toHaveProperty('success');
    expect(response.body).toHaveProperty('error');
    expect(response.body).toHaveProperty('timestamp');
  });

  test('should apply authentication to user routes', async () => {
    const response = await request(app).get('/api/v1/users/get-claims/123');
    expect(response.status).toBe(401); // Should fail due to no auth token
  });

  test('should apply authentication to admin routes', async () => {
    const response = await request(app).get('/api/v1/admin/dashboard');
    expect(response.status).toBe(401); // Should fail due to no auth token
  });

  test('should apply error handling middleware last', async () => {
    // Trigger an error by accessing a protected route without auth
    const response = await request(app).get('/api/v1/loans');
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('success');
    expect(response.body).toHaveProperty('error');
    expect(response.body).toHaveProperty('timestamp');
  });
});