import mongoose from 'mongoose'
import { updateIfCurrentPlugin } from 'mongoose-update-if-current'
// create a new ticket
interface ITicketProps {
  title: string
  price: number
  userId: string
}
// properties that user model has
interface ITicketModel extends mongoose.Model<ITicketDoc> {
  build(props: ITicketProps): ITicketDoc
}
// properties that user document has
interface ITicketDoc extends mongoose.Document {
  title: string
  price: number
  userId: string
  version: number
  orderId?: string
}
const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    orderId: {
      type: String,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id
        delete ret._id
      },
    },
  }
)
ticketSchema.set('versionKey', 'version')
ticketSchema.plugin(updateIfCurrentPlugin)
ticketSchema.statics.build = (props: ITicketProps) => {
  return new Ticket(props)
}

export const Ticket = mongoose.model<ITicketDoc, ITicketModel>(
  'Ticket',
  ticketSchema
)
