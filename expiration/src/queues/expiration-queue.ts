import Queue from 'bull'
import { ExpirationCompletePublisher } from '../events/publishers/expiation-complete-publisher'
import { natsWrapper } from '../nats-wrapper'
interface IPayload {
  orderID: string
}
const expirationQueue = new Queue<IPayload>('order:expiration', {
  redis: {
    host: process.env.REDIS_HOST,
  },
})

expirationQueue.process(async (job) => {
  console.log('publish expiration:complete event for orderId', job.data.orderID)
  new ExpirationCompletePublisher(natsWrapper.client).publish({
    orderId: job.data.orderID,
  })
})
export { expirationQueue }
