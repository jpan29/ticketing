import { IPaymentsCreatedEvent, Publisher, Subjects } from '@jpticketing/common'

export class PaymentCreatedPublisher extends Publisher<IPaymentsCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated
}
