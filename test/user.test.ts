import request from 'supertest';
import express from 'express';
import userRoutes from '../src/api/v1/routes/userRoutes';

const mockAuth = {
  setCustomUserClaims: jest.fn(),
  getUser: jest.fn(),
};

jest.mock('firebase-admin', () => ({
  auth: jest.fn(() => mockAuth),
}));

const app = express();
app.use(express.json());
app.use('/api/users', userRoutes);

describe('users API', () => {
  it('sets custom claims successfully', async () => {
    mockAuth.setCustomUserClaims.mockResolvedValue(undefined);

    const res = await request(app)
      .post('/api/users/set-user-claims')
      .send({ uid: 'user123', role: 'officer' });

    expect(res.status).toBe(200);
    expect(res.body.message).toContain('officer');
  });

  it('retrieves custom claims successfully', async () => {
    mockAuth.getUser.mockResolvedValue({
      uid: 'user123',
      customClaims: { role: 'officer' },
    });

    const res = await request(app).get('/api/users/get-claims/user123');

    expect(res.status).toBe(200);
    expect(res.body.claims.role).toBe('officer');
  });

  it('handles errors when setting claims fails', async () => {
    mockAuth.setCustomUserClaims.mockRejectedValue(new Error('Firebase error'));

    const res = await request(app)
      .post('/api/users/set-user-claims')
      .send({ uid: 'user123', role: 'admin' });

    expect(res.status).toBe(500);
    expect(res.body.error).toBe('Firebase error');
  });
});
