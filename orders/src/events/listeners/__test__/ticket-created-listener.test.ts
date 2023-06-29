import { ITicketCreatedEvent } from '@jpticketing/common'
import mongoose from 'mongoose'
import { natsWrapper } from '../../../nats-wrapper'
import { TicketCreatedListener } from '../ticket-created.listener'
import { Message } from 'node-nats-streaming'
import { Ticket } from '../../../models/ticket'

const setup = async () => {
  //create an instance of the listener
  const Listener = new TicketCreatedListener(natsWrapper.client)
  //create a fake data event

  const data: ITicketCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    title: 'test',
    price: 10,
    userId: new mongoose.Types.ObjectId().toHexString(),
  }
  //creata fake message
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  }
  return { Listener, data, msg }
}

it('creates and saves a ticket', async () => {
  const { Listener, data, msg } = await setup()
  //call onMessage
  await Listener.onMessage(data, msg)
  //ticket was created
  const ticket = await Ticket.findById(data.id)
  expect(ticket).toBeDefined()
  expect(ticket!.title).toEqual(data.title)
  expect(ticket!.price).toEqual(data.price)
})
it('acks the message', async () => {
  const { Listener, data, msg } = await setup()
  //call onMessage
  await Listener.onMessage(data, msg)
  //ticket was created
  expect(msg.ack).toHaveBeenCalled()
})
