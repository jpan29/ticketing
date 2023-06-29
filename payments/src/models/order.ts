import { OrderStatus } from '@jpticketing/common'
import mongoose from 'mongoose'
import { updateIfCurrentPlugin } from 'mongoose-update-if-current'

interface IOrderProps {
  id: string
  version: number
  status: OrderStatus
  userId: string
  price: number
}

interface IOrderDoc extends mongoose.Document {
  version: number
  status: OrderStatus
  userId: string
  price: number
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
    price: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
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
orderSchema.set('versionKey', 'version')
orderSchema.plugin(updateIfCurrentPlugin)
orderSchema.statics.build = (props: IOrderProps) => {
  return new Order({
    _id: props.id,
    version: props.version,
    status: props.status,
    userId: props.userId,
    price: props.price,
  })
}

export const Order = mongoose.model<IOrderDoc, IOrderModel>(
  'Order',
  orderSchema
)
