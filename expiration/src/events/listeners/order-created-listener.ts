import {
  IOrderCreatedEvent,
  Listener,
  OrderStatus,
  Subjects,
} from '@jpticketing/common'
import { Message } from 'node-nats-streaming'
import { expirationQueue } from '../../queues/expiration-queue'
import { queueGroupName } from './queue-group-name'

export class OrderCreatedListener extends Listener<IOrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated
  queueGroupName = queueGroupName

  async onMessage(data: IOrderCreatedEvent['data'], msg: Message) {
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime()
    console.log('waiting to process', delay)

    await expirationQueue.add(
      { orderID: data.id },
      {
        delay,
      }
    )
    msg.ack()
  }
}
