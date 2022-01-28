import request from 'supertest';
import app from '../src/index.js';
import { endPoints } from '../src/constants/index.js';

describe('Authentication requests', () => {
  test(`GET ${endPoints.newSession()}`, async () => {
    const { status } = await request(app).get(endPoints.newSession());
    expect(status).toEqual(200);
  });

  test(`POST ${endPoints.session()}`, async () => {
    const formData = { nickname: 'admin', password: 'admin' };
    const { status } = await request(app).post(endPoints.session()).type('form').send(formData);
    expect(status).toBe(302);
  });

  test(`POST ${endPoints.session()} (errors)`, async () => {
    const formData = { nickname: 'admin', password: '12' };
    const { status } = await request(app).post(endPoints.session()).type('form').send(formData);
    expect(status).toBe(422);
  });

  test(`DELETE ${endPoints.session()}`, async () => {
    const formData = { nickname: 'scudStorm', password: '11223344' };
    await request(app).post(endPoints.session()).type('form').send(formData);
    const { status } = await request(app).delete(endPoints.session());
    expect(status).toEqual(302);
  });

  test(`POST ${endPoints.users()}`, async () => {
    const formData = { nickname: 'happy22', password: 'HardPassword!' };
    const { status } = await request(app).post(endPoints.users()).type('form').send(formData);
    expect(status).toEqual(302);
  });

  test(`POST ${endPoints.users()} (errors)`, async () => {
    const formData = { nickname: 'admin', password: '12' };
    const { status } = await request(app).post(endPoints.users()).type('form').send(formData);
    expect(status).toEqual(422);
  });

  test(`GET ${endPoints.myPost()} (unauthorized)`, async () => {
    const { status } = await request(app).get(endPoints.myPosts());
    expect(status).toEqual(403);
  });
});
