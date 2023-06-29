import request from 'supertest'
import { app } from '../../app'

it('responds with detials about the current user', async () => {
  const auth = await request(app)
    .post('/api/users/signup')
    .send({ email: 'test@gmail.com', password: '123456' })
    .expect(201)
  const cookie = auth.get('Set-Cookie')

  const res = await request(app)
    .get('/api/users/currentuser')
    .set('Cookie', cookie)
    .send()
    .expect(200)

  expect(res.body.currentUser.email).toEqual('test@gmail.com')
})
it('responds null with not authorized', async () => {
  const auth = await request(app)
    .post('/api/users/signup')
    .send({ email: 'test@gmail.com', password: '123456' })
    .expect(201)
  const cookie = auth.get('Set-Cookie')

  const res = await request(app)
    .get('/api/users/currentuser')
    .send()
    .expect(200)

  expect(res.body.currentUser).toEqual(null)
})
