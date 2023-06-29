import { IOrderCreatedEvent, OrderStatus } from '@jpticketing/common'
import mongoose from 'mongoose'
import { natsWrapper } from '../../../nats-wrapper'
import { OrderCreatedListener } from '../order-created-listener'
import { Message } from 'node-nats-streaming'
import { Ticket } from '../../../models/ticket'

const setup = async () => {
  //create an instance of the listener
  const Listener = new OrderCreatedListener(natsWrapper.client)
  const ticket = Ticket.build({
    title: 'test',
    price: 10,
    userId: '123',
  })
  await ticket.save()
  //create a fake data event

  const data: IOrderCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    userId: '321',
    expiresAt: new Date().toISOString(),
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
  }
  //creata fake message
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  }
  return { Listener, data, ticket, msg }
}
it('sets the orderId of the ticket', async () => {
  const { Listener, data, ticket, msg } = await setup()

  await Listener.onMessage(data, msg)
  const updatedTicket = await Ticket.findById(ticket.id)
  expect(updatedTicket!.orderId).toEqual(data.id)
})

it('acks the message', async () => {
  const { Listener, data, ticket, msg } = await setup()

  await Listener.onMessage(data, msg)
  expect(msg.ack).toHaveBeenCalled()
})

it('publishes a ticket updated event', async () => {
  const { Listener, data, ticket, msg } = await setup()

  await Listener.onMessage(data, msg)
  expect(natsWrapper.client.publish).toHaveBeenCalled()

  const updatedTicket = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  )

  expect(data.id).toEqual(updatedTicket.orderId)
})
