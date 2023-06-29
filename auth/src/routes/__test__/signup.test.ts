import request from 'supertest'
import { app } from '../../app'

it('returns 201 on sucessful signup', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({ email: 'test@gmail.com', password: '12345' })
    .expect(201)
})
it('returns 400 with invalid email', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({ email: 'test.com', password: '12345' })
    .expect(400)
})
it('returns 400 with invalid password', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({ email: 'test.com', password: 'p' })
    .expect(400)
})
it('returns 400 with missing email and password', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({ email: 'test@gmail.com' })
    .expect(400)

  return request(app)
    .post('/api/users/signup')
    .send({ password: 'p' })
    .expect(400)
})
it('disallows duplicated emails', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({ email: 'test@gmail.com', password: '12345' })
    .expect(201)

  return request(app)
    .post('/api/users/signup')
    .send({ email: 'test@gmail.com', password: '12345' })
    .expect(400)
})
it('sets a cookie after successful signup', async () => {
  const res = await request(app)
    .post('/api/users/signup')
    .send({ email: 'test@gmail.com', password: '12345' })
    .expect(201)
  expect(res.get('Set-Cookie')).toBeDefined()
})
