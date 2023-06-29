import { OrderStatus } from '@jpticketing/common'
import mongoose from 'mongoose'
import { Order } from './order'
import { updateIfCurrentPlugin } from 'mongoose-update-if-current'

interface ITicketProps {
  id: string
  title: string
  price: number
}
export interface ITicketDoc extends mongoose.Document {
  title: string
  price: number
  version: number
  isReserved(): Promise<boolean>
}

interface ITicketModel extends mongoose.Model<ITicketDoc> {
  build(props: ITicketProps): ITicketDoc
  findByEvent(event: {
    id: string
    version: number
  }): Promise<ITicketDoc | null>
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
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id
        delete ret._id
        delete ret.__v
      },
    },
  }
)
ticketSchema.set('versionKey', 'version')
// ticketSchema.plugin(updateIfCurrentPlugin)

ticketSchema.pre('save', function (done) {
  this.$where = {
    version: this.get('version') - 1,
  }
  done()
})
ticketSchema.statics.findByEvent = async (event: {
  id: string
  version: number
}) => {
  return Ticket.findOne({
    _id: event.id,
    version: event.version - 1,
  })
}
ticketSchema.statics.build = (props: ITicketProps) => {
  return new Ticket({
    _id: props.id,
    title: props.title,
    price: props.price,
  })
}
ticketSchema.methods.isReserved = async function () {
  const existingOrder = await Order.findOne({
    ticket: this,
    status: {
      $in: [
        OrderStatus.Created,
        OrderStatus.AwaitingPayment,
        OrderStatus.Complete,
      ],
    },
  })

  return !!existingOrder
}

export const Ticket = mongoose.model<ITicketDoc, ITicketModel>(
  'Ticket',
  ticketSchema
)
