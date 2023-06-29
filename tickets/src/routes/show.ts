import { NotFoundError } from '@jpticketing/common'
import express, { Request, Response } from 'express'
import { Ticket } from '../models/ticket'
const router = express.Router()

router.get('/api/tickets/:id', async (req: Request, res: Response) => {
  const ticket = await Ticket.findById({ _id: req.params.id })
  console.log(ticket)

  if (!ticket) throw new NotFoundError()
  res.status(200).send(ticket)
})

export { router as showTicketRouter }
