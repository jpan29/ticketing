import { Publisher, Subjects, IOrderCreatedEvent } from '@jpticketing/common'

export class OrderCreatedPubliser extends Publisher<IOrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated
}
