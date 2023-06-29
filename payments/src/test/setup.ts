import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'
import jwt from 'jsonwebtoken'

jest.mock('../nats-wrapper')
process.env.STRIPE_KEY =
  'sk_test_51NOG0IIAzMydkFVLmbHbWjgPq6WIC9V1GOL6asrAYysyIOQA1OWHDH4EW5X4sdHE1ZWxXrxYuzy8yLCeu9dMMtyj008soe78zc'
let mongo: any
beforeAll(async () => {
  process.env.JWT_KEY = 'secretkey'

  mongo = await MongoMemoryServer.create()
  const uri = mongo.getUri()
  await mongoose.connect(uri)
})
beforeEach(async () => {
  jest.clearAllMocks()
  const collections = await mongoose.connection.db.collections()
  for (let c of collections) {
    await c.deleteMany({})
  }
})

afterAll(async () => {
  await mongo.stop()
  await mongoose.connection.close()
})

global.signin = (id?: string) => {
  const payload = {
    id: id || new mongoose.Types.ObjectId().toHexString(),
    email: 'test@test.com',
  }
  const token = jwt.sign(payload, process.env.JWT_KEY!)
  const ssesion = { jwt: token }
  const sessionJSON = JSON.stringify(ssesion)
  const base64 = Buffer.from(sessionJSON).toString('base64')
  return [`session=${base64}`]
}
