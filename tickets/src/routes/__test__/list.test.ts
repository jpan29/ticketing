import request from 'supertest'
import { app } from '../../app'

it('returns 200 after send get request to fetch all tickets', async () => {
  await request(app).get('/api/tickets').send().expect(200)
})
