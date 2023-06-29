import { ITicketUpdatedEvent } from '@jpticketing/common'
import mongoose from 'mongoose'
import { natsWrapper } from '../../../nats-wrapper'

import { Message } from 'node-nats-streaming'
import { Ticket } from '../../../models/ticket'
import { TicketUpdatedListener } from '../ticket-updated-listener'

const setup = async () => {
  //create an instance of the listener
  const Listener = new TicketUpdatedListener(natsWrapper.client)
  //create and save a ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'test',
    price: 10,
  })
  await ticket.save()
  //create a fake data event

  const data: ITicketUpdatedEvent['data'] = {
    id: ticket.id,
    version: ticket.version + 1,
    title: 'new title',
    price: 20,
    userId: new mongoose.Types.ObjectId().toHexString(),
  }
  //creata fake message
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  }
  return { Listener, data, ticket, msg }
}

it('finds,updates and saves a ticket', async () => {
  const { Listener, data, ticket, msg } = await setup()
  await Listener.onMessage(data, msg)
  const updatedTicket = await Ticket.findById(ticket.id)
  expect(updatedTicket?.title).toEqual(data.title)
  expect(updatedTicket?.price).toEqual(data.price)
  expect(updatedTicket?.version).toEqual(data.version)
})

it('acks the message', async () => {
  const { Listener, data, ticket, msg } = await setup()
  await Listener.onMessage(data, msg)

  expect(msg.ack).toHaveBeenCalled()
})

it('does not call ack if the event has a skipped version number', async () => {
  const { Listener, data, ticket, msg } = await setup()
  data.version = 10
  try {
    await Listener.onMessage(data, msg)
  } catch (err) {}

  expect(msg.ack).not.toHaveBeenCalled()
})
