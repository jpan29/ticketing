import { Publisher, Subjects, IOrderCancelledEvent } from '@jpticketing/common'

export class OrderCancelledPubliser extends Publisher<IOrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled
}
