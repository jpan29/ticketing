import { OrderStatus } from '@jpticketing/common'
import mongoose from 'mongoose'
import { ITicketDoc } from './ticket'
import { updateIfCurrentPlugin } from 'mongoose-update-if-current'

interface IOrderProps {
  userId: string
  status: OrderStatus
  expiresAt: Date
  ticket: ITicketDoc
}

interface IOrderDoc extends mongoose.Document {
  userId: string
  status: OrderStatus
  expiresAt: Date
  ticket: ITicketDoc
  version: number
}

interface IOrderModel extends mongoose.Model<IOrderDoc> {
  build(props: IOrderProps): IOrderDoc
}

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(OrderStatus),
      default: OrderStatus.Created,
    },
    expiresAt: { type: mongoose.Schema.Types.Date },
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ticket',
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
orderSchema.set('versionKey', 'version')
orderSchema.plugin(updateIfCurrentPlugin)
orderSchema.statics.build = (props: IOrderProps) => {
  return new Order(props)
}

export const Order = mongoose.model<IOrderDoc, IOrderModel>(
  'Order',
  orderSchema
)
