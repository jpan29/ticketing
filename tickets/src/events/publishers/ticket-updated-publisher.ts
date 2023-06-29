import { Publisher, Subjects, ITicketUpdatedEvent } from '@jpticketing/common'

export class TicketUpdatedPubliser extends Publisher<ITicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated
}
