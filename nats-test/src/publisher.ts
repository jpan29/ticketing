import nats from 'node-nats-streaming'
import { TicketCreatedPubliser } from '../../tickets/src/events/publishers/ticket-created-publisher'

const stan = nats.connect('ticketing', 'abc', {
  url: 'http://localhost:4222',
})

stan.on('connect', async () => {
  console.log('Publisher connected to NATS')
  const publisher = new TicketCreatedPubliser(stan)
  try {
    await publisher.publish({
      id: '123',
      title: 'concert',
      price: 20,
      userId: '',
    })
  } catch (err) {
    console.error(err)
  }
})
