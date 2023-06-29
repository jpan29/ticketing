import {
  IExpirationCompleteEvent,
  Listener,
  Subjects,
  OrderStatus,
} from '@jpticketing/common'
import { Message } from 'node-nats-streaming'
import { Order } from '../../models/order'
import { natsWrapper } from '../../nats-wrapper'
import { OrderCancelledPubliser } from '../publishers/order-cancelled-publisher'
import { queueGroupName } from './queue-group-name'

export class ExpirationCompleteListener extends Listener<IExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete
  queueGroupName = queueGroupName
  async onMessage(data: IExpirationCompleteEvent['data'], msg: Message) {
    const { orderId } = data
    const order = await Order.findById(orderId).populate('ticket')
    if (!order) throw new Error('Order not found')
    if (order.status === OrderStatus.Complete) {
      return msg.ack()
    }
    order.set({
      status: OrderStatus.Cancelled,
    })
    await order.save()
    new OrderCancelledPubliser(this.client).publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id,
      },
    })
    msg.ack()
  }
}
