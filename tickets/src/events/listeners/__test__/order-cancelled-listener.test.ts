import { IOrderCancelledEvent } from '@jpticketing/common'
import mongoose from 'mongoose'
import { natsWrapper } from '../../../nats-wrapper'
import { Message } from 'node-nats-streaming'
import { Ticket } from '../../../models/ticket'
import { OrderCancelledListener } from '../order-cancelled-listener'

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client)
  const orderId = new mongoose.Types.ObjectId().toHexString()
  const ticket = Ticket.build({
    title: 'test',
    price: 10,
    userId: '123',
  })
  ticket.set({ orderId })
  await ticket.save()

  const data: IOrderCancelledEvent['data'] = {
    id: orderId,
    version: 0,
    ticket: {
      id: ticket.id,
    },
  }
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  }
  return { listener, data, ticket, msg }
}

it('updates the event, publishes an event and acks trhe message', async () => {
  const { listener, data, ticket, msg } = await setup()
  await listener.onMessage(data, msg)
  const updatedTicket = await Ticket.findById(ticket.id)
  expect(updatedTicket!.orderId).not.toBeDefined()
  expect(natsWrapper.client.publish).toHaveBeenCalled()
})
