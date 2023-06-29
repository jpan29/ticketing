import { OrderStatus } from '@jpticketing/common'
import mongoose from 'mongoose'
import request from 'supertest'
import { app } from '../../app'
import { Order } from '../../models/order'
import { Ticket } from '../../models/ticket'

it('returns orders for a particular user', async () => {
  const ticketOne = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'test1',
    price: 100,
  })
  const ticketTwo = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'test2',
    price: 200,
  })
  const ticketThree = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'test3',
    price: 300,
  })
  await ticketOne.save()
  await ticketTwo.save()
  await ticketThree.save()

  const userOne = global.signin()
  const userTwo = global.signin()

  await request(app)
    .post('/api/orders')
    .set('Cookie', userOne)
    .send({ ticketId: ticketOne.id })
    .expect(201)

  const { body: orderOne } = await request(app)
    .post('/api/orders')
    .set('Cookie', userTwo)
    .send({ ticketId: ticketTwo.id })
    .expect(201)

  const { body: orderTwo } = await request(app)
    .post('/api/orders')
    .set('Cookie', userTwo)
    .send({ ticketId: ticketThree.id })
    .expect(201)

  const res = await request(app)
    .get('/api/orders')
    .set('Cookie', userTwo)
    .send()
    .expect(200)
  expect(res.body.length).toEqual(2)
  expect(res.body[0].id).toEqual(orderOne.id)
  expect(res.body[1].id).toEqual(orderTwo.id)
  expect(res.body[0].ticket.id).toEqual(orderOne.ticket.id)
  expect(res.body[1].ticket.id).toEqual(orderTwo.ticket.id)
})
