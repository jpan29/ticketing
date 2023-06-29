import mongoose from 'mongoose'

interface IPaymentsProps {
  orderId: string
  stripeId: string
}

interface IPaymentsDoc extends mongoose.Document {
  orderId: string
  stripeId: string
}

interface IPaymentsModel extends mongoose.Model<IPaymentsDoc> {
  build(props: IPaymentsProps): IPaymentsDoc
}

const paymentSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
    },
    stripeId: {
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

paymentSchema.statics.build = (props: IPaymentsProps) => {
  return new Payment(props)
}

export const Payment = mongoose.model<IPaymentsDoc, IPaymentsModel>(
  'Payment',
  paymentSchema
)
