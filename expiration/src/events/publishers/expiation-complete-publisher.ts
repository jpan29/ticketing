import { Publisher, Subjects } from '@jpticketing/common'
import { IExpirationCompleteEvent } from '@jpticketing/common'

export class ExpirationCompletePublisher extends Publisher<IExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete
}
