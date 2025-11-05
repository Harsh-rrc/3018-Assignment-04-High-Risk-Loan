import request from 'supertest';
import express from 'express';
import userRoutes from '../src/api/v1/routes/userRoutes';
import authenticate from '../src/api/v1/middleware/authenticate';
import { authorize } from '../src/api/v1/middleware/authorization';

const mockAuth = {
  setCustomUserClaims: jest.fn(),
  getUser: jest.fn(),
};

jest.mock('firebase-admin', () => ({
  auth: jest.fn(() => mockAuth),
}));

jest.mock('../src/config/firebase', () => ({
  auth: {
    verifyIdToken: jest.fn(),
  },
}));

const { auth } = require('../src/config/firebase');

const app = express();
app.use(express.json());
app.use('/api/users', authenticate, authorize({ roles: ["manager"] }), userRoutes);

describe('users API', () => {
  beforeEach(() => {
    (auth.verifyIdToken as jest.Mock).mockResolvedValue({
      uid: 'manager123',
      role: 'manager',
    });
  });

  it('sets custom claims successfully', async () => {
    mockAuth.setCustomUserClaims.mockResolvedValue(undefined);

    const res = await request(app)
      .post('/api/users/set-user-claims')
      .set('Authorization', 'Bearer valid-token')
      .send({ uid: 'user123', role: 'officer' });

    expect(res.status).toBe(200);
    expect(res.body.message).toContain('officer');
  });

  it('retrieves custom claims successfully', async () => {
    mockAuth.getUser.mockResolvedValue({
      uid: 'user123',
      customClaims: { role: 'officer' },
    });

    const res = await request(app)
      .get('/api/users/get-claims/user123')
      .set('Authorization', 'Bearer valid-token');

    expect(res.status).toBe(200);
    expect(res.body.claims.role).toBe('officer');
  });

  it('handles errors when setting claims fails', async () => {
    mockAuth.setCustomUserClaims.mockRejectedValue(new Error('Firebase error'));

    const res = await request(app)
      .post('/api/users/set-user-claims')
      .set('Authorization', 'Bearer valid-token')
      .send({ uid: 'user123', role: 'admin' });

    expect(res.status).toBe(500);
    expect(res.body.error).toBe('Firebase error');
  });

  it('handles missing uid in set claims request', async () => {
    const res = await request(app)
      .post('/api/users/set-user-claims')
      .set('Authorization', 'Bearer valid-token')
      .send({ role: 'manager' });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('UID and role are required.');
  });

  it('handles missing role in set claims request', async () => {
    const res = await request(app)
      .post('/api/users/set-user-claims')
      .set('Authorization', 'Bearer valid-token')
      .send({ uid: 'user123' });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('UID and role are required.');
  });

  it('handles errors when retrieving claims fails', async () => {
    mockAuth.getUser.mockRejectedValue(new Error('User not found'));

    const res = await request(app)
      .get('/api/users/get-claims/user123')
      .set('Authorization', 'Bearer valid-token');

    expect(res.status).toBe(500);
    expect(res.body.error).toBe('User not found');
  });
});
