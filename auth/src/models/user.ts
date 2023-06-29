import mongoose from 'mongoose'
import { Password } from '../services/password'
// create a new user
interface IUserProps {
  email: string
  password: string
}
// properties that user model has
interface IUserModel extends mongoose.Model<IUserDoc> {
  build(props: IUserProps): IUserDoc
}
// properties that user document has
interface IUserDoc extends mongoose.Document {
  email: string
  password: string
}
const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    password: { type: String, required: true },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id
        delete ret._id
        delete ret.password
        delete ret.__v
      },
    },
  }
)
userSchema.pre('save', async function (done) {
  if (this.isModified('password')) {
    const hashed = await Password.toHash(this.get('password'))
    this.set('password', hashed)
    done()
  }
})
userSchema.statics.build = (props: IUserProps) => {
  return new User(props)
}

export const User = mongoose.model<IUserDoc, IUserModel>('User', userSchema)
