import { IOrderCancelledEvent, OrderStatus } from '@jpticketing/common'
import mongoose from 'mongoose'
import { Order } from '../../../models/order'
import { natsWrapper } from '../../../nats-wrapper'
import { OrderCancelledListener } from '../order-cancelled-listener'

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client)
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    price: 10,
    userId: '123',
  })
  await order.save()
  const data: IOrderCancelledEvent['data'] = {
    id: order.id,
    version: 1,
    ticket: {
      id: '123123',
    },
  }
  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  }
  return { listener, data, msg }
}

it('updates the status of the order', async () => {
  const { listener, data, msg } = await setup()
  await listener.onMessage(data, msg)
  const updatedOrder = await Order.findById(data.id)
  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled)
})
it('acks the message', async () => {
  const { listener, data, msg } = await setup()
  await listener.onMessage(data, msg)

  expect(msg.ack).toHaveBeenCalled()
})
