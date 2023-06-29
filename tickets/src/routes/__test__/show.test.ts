import mongoose from 'mongoose'
import request from 'supertest'
import { app } from '../../app'

it('returns 404 if the ticket is not found', async () => {
  const id = new mongoose.Types.ObjectId().toHexString()
  await request(app).get(`/api/tickets/${id}`).send().expect(404)
})

it('returns 200 if the ticket is found', async () => {
  const res = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({ title: 'test123', price: 10 })
    .expect(201)

  await request(app).get(`/api/tickets/${res.body.id}`).send().expect(200)
})
