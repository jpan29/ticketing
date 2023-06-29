import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'

let mongo: any
beforeAll(async () => {
  process.env.JWT_KEY = 'secretkey'

  mongo = await MongoMemoryServer.create()
  const uri = mongo.getUri()
  await mongoose.connect(uri)
})
beforeEach(async () => {
  const collections = await mongoose.connection.db.collections()
  for (let c of collections) {
    await c.deleteMany({})
  }
})

afterAll(async () => {
  await mongo.stop()
  await mongoose.connection.close()
})
