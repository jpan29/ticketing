import mongoose from 'mongoose'
import request from 'supertest'
import { app } from '../../app'
import { Ticket } from '../../models/ticket'
import { natsWrapper } from '../../nats-wrapper'

it('returns 404 if provided id does not exist', async () => {
  const id = new mongoose.Types.ObjectId().toHexString()
  await request(app)
    .patch(`/api/tickets/${id}`)
    .set('Cookie', global.signin())
    .send({ title: 'test', price: 20 })
    .expect(404)
})
it('returns 401 if non authorized user update ticket', async () => {
  const res = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({ title: 'test', price: 10 })
    .expect(201)

  await request(app)
    .patch(`/api/tickets/${res.body.id}`)
    .send({ title: 'test', price: 20 })
    .expect(401)
})
it('returns 401 if user does not own the ticket', async () => {
  const res = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({ title: 'test', price: 10 })
    .expect(201)

  await request(app)
    .patch(`/api/tickets/${res.body.id}`)
    .set('Cookie', global.signin())
    .send({ title: 'test', price: 20 })
    .expect(401)
})
it('returns 400 if user provide invalid title or price', async () => {
  const cookie = global.signin()
  const res = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({ title: 'test', price: 10 })
    .expect(201)
  await request(app)
    .patch(`/api/tickets/${res.body.id}`)
    .set('Cookie', cookie)
    .send({ title: '', price: 20 })
    .expect(400)
  await request(app)
    .patch(`/api/tickets/${res.body.id}`)
    .set('Cookie', cookie)
    .send({ title: 'new test', price: -10 })
    .expect(400)
})
it('returns 200 if authorized user update ticket', async () => {
  const cookie = global.signin()
  const res = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({ title: 'test', price: 10 })
    .expect(201)

  await request(app)
    .patch(`/api/tickets/${res.body.id}`)
    .set('Cookie', cookie)
    .send({ title: 'test', price: 20 })
    .expect(200)
})

it('publishes a update event', async () => {
  const cookie = global.signin()
  const res = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({ title: 'test', price: 10 })
    .expect(201)

  await request(app)
    .patch(`/api/tickets/${res.body.id}`)
    .set('Cookie', cookie)
    .send({ title: 'test', price: 20 })
    .expect(200)

  expect(natsWrapper.client.publish).toHaveBeenCalled()
})

it('rejects update a ticket if the tickets is reserved', async () => {
  const cookie = global.signin()
  const res = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({ title: 'test', price: 10 })
    .expect(201)

  const ticket = await Ticket.findById(res.body.id)
  ticket!.set({ orderId: new mongoose.Types.ObjectId().toHexString() })
  await ticket!.save()
  await request(app)
    .patch(`/api/tickets/${res.body.id}`)
    .set('Cookie', cookie)
    .send({ title: 'test', price: 20 })
    .expect(400)
})
