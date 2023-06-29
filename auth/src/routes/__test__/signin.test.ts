import request from 'supertest'
import { app } from '../../app'

it('returns 400 with email that does not exsit', async () => {
  return request(app)
    .post('/api/users/signin')
    .send({ email: 'test@gmail.com', password: '12345' })
    .expect(400)
})

it('returns 400 when input incorrect password ', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({ email: 'test@gmail.com', password: '12345' })
    .expect(201)

  return request(app)
    .post('/api/users/signin')
    .send({ email: 'test@gmail.com', password: '12346' })
    .expect(400)
})

it('response with a cookie when given valid credentials', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({ email: 'test@gmail.com', password: '12345' })
    .expect(201)
  const res = await request(app)
    .post('/api/users/signin')
    .send({ email: 'test@gmail.com', password: '12345' })
    .expect(200)

  expect(res.get('Set-Cookie')).toBeDefined()
})
