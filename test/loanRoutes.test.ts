import request from 'supertest';
import app from '../src/app';

jest.mock('../src/config/firebase', () => ({
  auth: {
    verifyIdToken: jest.fn(),
  },
}));

// Import the mocked auth
const { auth } = require('../src/config/firebase');

describe('Loan Routes', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    (auth.verifyIdToken as jest.Mock).mockResolvedValue({
      uid: 'user123',
      role: 'user',
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('POST /api/v1/loans -> should create a loan and return 201', async () => {
    const res = await request(app)
      .post('/api/v1/loans')
      .set('Authorization', 'Bearer valid-token')
      .send({ applicant: 'Harsh Pandya', amount: 10000 });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.applicant).toBe('Harsh Pandya');
  });

  it('GET /api/v1/loans -> should return 200 with an array', async () => {
    (auth.verifyIdToken as jest.Mock).mockResolvedValue({
      uid: 'officer123',
      role: 'officer',
    });

    const res = await request(app)
      .get('/api/v1/loans')
      .set('Authorization', 'Bearer valid-token');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('PUT /api/v1/loans/:id/review -> should return 200', async () => {
    (auth.verifyIdToken as jest.Mock).mockResolvedValue({
      uid: 'officer123',
      role: 'officer',
    });

    const res = await request(app)
      .put('/api/v1/loans/1/review')
      .set('Authorization', 'Bearer valid-token')
      .send({ status: 'under review' });

    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/reviewed/i);
  });

  it('PUT /api/v1/loans/:id/approve -> should return 200', async () => {
    (auth.verifyIdToken as jest.Mock).mockResolvedValue({
      uid: 'manager123',
      role: 'manager',
    });

    const res = await request(app)
      .put('/api/v1/loans/1/approve')
      .set('Authorization', 'Bearer valid-token')
      .send({ approved: true });

    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/approved/i);
  });

  it('POST /api/v1/loans -> should deny access without authentication', async () => {
    const res = await request(app)
      .post('/api/v1/loans')
      .send({ applicant: 'John Doe', amount: 10000 });

    expect(res.status).toBe(401);
  });

  it('GET /api/v1/loans -> should deny access without authentication', async () => {
    const res = await request(app).get('/api/v1/loans');

    expect(res.status).toBe(401);
  });

  it('PUT /api/v1/loans/:id/review -> should deny access without authentication', async () => {
    const res = await request(app).put('/api/v1/loans/1/review');

    expect(res.status).toBe(401);
  });

  it('PUT /api/v1/loans/:id/approve -> should deny access without authentication', async () => {
    const res = await request(app).put('/api/v1/loans/1/approve');

    expect(res.status).toBe(401);
  });

  it('POST /api/v1/loans -> should deny access with insufficient role', async () => {
    (auth.verifyIdToken as jest.Mock).mockResolvedValue({
      uid: 'user123',
      role: 'officer', // Wrong role for creating loan
    });

    const res = await request(app)
      .post('/api/v1/loans')
      .set('Authorization', 'Bearer valid-token')
      .send({ applicant: 'John Doe', amount: 10000 });

    expect(res.status).toBe(403);
  });

  it('GET /api/v1/loans -> should deny access with insufficient role', async () => {
    (auth.verifyIdToken as jest.Mock).mockResolvedValue({
      uid: 'user123',
      role: 'user', // Wrong role for viewing loans
    });

    const res = await request(app)
      .get('/api/v1/loans')
      .set('Authorization', 'Bearer valid-token');

    expect(res.status).toBe(403);
  });
});