import request from 'supertest';
import app from '../src/index.js';
import { endPoints } from '../src/constants/index.js';

describe('Public requests', () => {
  test(`GET ${endPoints.main()}`, async () => {
    const { status } = await request(app).get(endPoints.main());
    expect(status).toEqual(200);
  });

  test(`GET ${endPoints.post()}`, async () => {
    const { status } = await request(app).get('/posts/1');
    expect(status).toEqual(200);
  });

  test(`GET ${endPoints.post()} (unknown)`, async () => {
    const { status } = await request(app).get('/posts/-1');
    expect(status).toEqual(404);
  });

  test(`GET ${endPoints.newUser()}`, async () => {
    const { status } = await request(app).get(endPoints.newUser());
    expect(status).toEqual(200);
  });

  test('GET /undefined', async () => {
    const { status } = await request(app).get('/undefined');
    expect(status).toEqual(404);
  });
});
