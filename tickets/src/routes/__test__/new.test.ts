import request from 'supertest'
import { app } from '../../app'
import { Ticket } from '../../models/ticket'
import { natsWrapper } from '../../nats-wrapper'

it('has a router listening to /api/tickets for post request', async () => {
  const res = await request(app).post('/api/tickets').send({})
  expect(res.status).not.toEqual(404)
})
it('can only be accessed if the user is signed', async () => {
  await request(app).post('/api/tickets').send({}).expect(401)
})
it('return 201 if user is signed in', async () => {
  const res = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({})
  expect(res.status).not.toEqual(401)
})
it('returns an error if an invalid title is provided', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({ title: '', price: 12 })
    .expect(400)
})

it('returns an error if an invalid price is provided', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({ title: 'test' })
    .expect(400)
})
it('creates a ticket with valid inputs', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({ title: 'test', price: 12 })
    .expect(201)
  const tickets = await Ticket.find({})
  expect(tickets[0].price).toEqual(12)
})

it('publishes a create event', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({ title: 'test', price: 12 })
    .expect(201)

  expect(natsWrapper.client.publish).toHaveBeenCalled()
})
