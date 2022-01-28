import request from 'supertest';
import app from '../src/index.js';
import { endPoints } from '../src/constants/index.js';

describe('Private requests', () => {
  let cookie;

  beforeEach(async () => {
    const formData = { nickname: 'admin', password: 'admin' };
    const authRes = await request(app).post(endPoints.session()).type('form').send(formData);
    cookie = authRes.headers['set-cookie'];
  });

  test(`GET ${endPoints.myPosts()}`, async () => {
    const { status } = await request(app).get(endPoints.myPosts()).set('Cookie', cookie);
    expect(status).toEqual(200);
  });

  test(`POST ${endPoints.myPosts()}`, async () => {
    const formData = { title: 'post title', body: 'post body' };
    const { status } = await request(app)
      .post(endPoints.myPosts())
      .type('form')
      .set('Cookie', cookie)
      .send(formData);
    expect(status).toEqual(302);
  });

  test(`POST ${endPoints.myPosts()} (errors)`, async () => {
    const formData = { title: '', body: '' };
    const { status } = await request(app)
      .post(endPoints.myPosts())
      .type('form')
      .set('Cookie', cookie)
      .send(formData);
    expect(status).toEqual(422);
  });

  test(`GET ${endPoints.myNewPost()}`, async () => {
    const { status } = await request(app).get(endPoints.myNewPost()).set('Cookie', cookie);
    expect(status).toEqual(200);
  });

  test(`GET ${endPoints.myPost()}`, async () => {
    const query = request(app);
    const formData = { title: 'post title', body: 'post body' };
    const { headers } = await request(app)
      .post(endPoints.myPosts())
      .type('form')
      .set('Cookie', cookie)
      .send(formData);
    const { status } = await query.get(headers.location).set('Cookie', cookie);
    expect(status).toEqual(200);
  });

  test(`PATCH ${endPoints.myPost()}`, async () => {
    const formData = { title: 'post title', body: 'post body' };
    const { headers } = await request(app)
      .post(endPoints.myPosts())
      .type('form')
      .set('Cookie', cookie)
      .send(formData);
    const { status } = await request(app)
      .patch(headers.location)
      .type('form')
      .send(formData)
      .set('Cookie', cookie);
    expect(status).toEqual(302);
  });

  test(`PATCH ${endPoints.myPost()} (not found)`, async () => {
    const { status } = await request(app).patch('/my/posts/-1').set('Cookie', cookie);
    expect(status).toEqual(404);
  });

  test(`PATCH ${endPoints.myPost()} (unprocessable entity)`, async () => {
    const formData = { title: 'post title', body: 'post body' };
    const { headers } = await request(app)
      .post(endPoints.myPosts())
      .type('form')
      .set('Cookie', cookie)
      .send(formData);
    const { status } = await request(app)
      .patch(headers.location)
      .type('form')
      .set('Cookie', cookie)
      .send({ title: '', body: '' });
    expect(status).toEqual(422);
  });

  test(`DELETE ${endPoints.myPost()}`, async () => {
    const formData = { title: 'post title', body: 'post body' };
    const { headers } = await request(app)
      .post(endPoints.myPosts())
      .type('form')
      .set('Cookie', cookie)
      .send(formData);
    const url = headers.location;
    const res1 = await request(app).delete(url).set('Cookie', cookie);
    expect(res1.status).toEqual(302);
    const res2 = await request(app).get(url).set('Cookie', cookie);
    expect(res2.status).toEqual(404);
  });
});
