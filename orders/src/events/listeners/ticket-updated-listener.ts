import {
  ITicketUpdatedEvent,
  Listener,
  NotFoundError,
  Subjects,
} from '@jpticketing/common'
import { Message } from 'node-nats-streaming'
import { Ticket } from '../../models/ticket'
import { queueGroupName } from './queue-group-name'

export class TicketUpdatedListener extends Listener<ITicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated
  queueGroupName = queueGroupName
  async onMessage(data: ITicketUpdatedEvent['data'], msg: Message) {
    const ticket = await Ticket.findByEvent(data)

    if (!ticket) throw new NotFoundError()

    const { title, price, version } = data
    ticket.set({ title, price, version })
    await ticket.save()
    msg.ack()
  }
}
