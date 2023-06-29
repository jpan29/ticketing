import { Listener, IOrderCreatedEvent, Subjects } from '@jpticketing/common'
import { queueGroupName } from './queue-group-name'
import { Message } from 'node-nats-streaming'
import { Ticket } from '../../models/ticket'
import { TicketUpdatedPubliser } from '../publishers/ticket-updated-publisher'
export class OrderCreatedListener extends Listener<IOrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated
  queueGroupName = queueGroupName
  async onMessage(data: IOrderCreatedEvent['data'], msg: Message) {
    const ticket = await Ticket.findById(data.ticket.id)
    if (!ticket) throw new Error('Ticket not found')
    ticket.set({ orderId: data.id })

    await ticket.save()

    await new TicketUpdatedPubliser(this.client).publish({
      id: ticket.id,
      version: ticket.version,
      price: ticket.price,
      userId: ticket.userId,
      title: ticket.title,
      orderId: ticket.orderId,
    })
    msg.ack()
  }
}
