import request from 'supertest';
import app from '../src/app';

describe('Loan Routes (no auth yet)', () => {
  it('POST /api/v1/loans -> should create a loan and return 201', async () => {
    const res = await request(app)
      .post('/api/v1/loans')
      .send({ applicant: 'Harsh Pandya', amount: 10000 });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.applicant).toBe('Harsh Pandya');
  });

  it('GET /api/v1/loans -> should return 200 with an array', async () => {
    const res = await request(app).get('/api/v1/loans');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('PUT /api/v1/loans/:id/review -> should return 200', async () => {
    const res = await request(app)
      .put('/api/v1/loans/1/review')
      .send({ status: 'under review' });

    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/reviewed/i);
  });

  it('PUT /api/v1/loans/:id/approve -> should return 200', async () => {
    const res = await request(app)
      .put('/api/v1/loans/1/approve')
      .send({ approved: true });

    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/approved/i);
  });
});