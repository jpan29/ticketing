import { Publisher, Subjects, ITicketCreatedEvent } from '@jpticketing/common'

export class TicketCreatedPubliser extends Publisher<ITicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated
}
