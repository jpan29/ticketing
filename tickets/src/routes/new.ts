import {
  BadRequestError,
  requireAuth,
  validateRequest,
} from '@jpticketing/common'
import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import { TicketCreatedPubliser } from '../events/publishers/ticket-created-publisher'
import { Ticket } from '../models/ticket'
import { natsWrapper } from '../nats-wrapper'
const router = express.Router()
router.post(
  '/api/tickets',
  requireAuth,
  [
    body('title').not().isEmpty().withMessage('Title is required'),
    body('price')
      .isFloat({ gt: 0 })
      .withMessage('Price must be greater than 0'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price } = req.body
    const existingTicket = await Ticket.findOne({ title })

    if (existingTicket) {
      throw new BadRequestError('Ticket has been existed')
    }

    const ticket = Ticket.build({ title, price, userId: req.currentUser!.id })
    await ticket.save()
    new TicketCreatedPubliser(natsWrapper.client).publish({
      id: ticket.id,
      version: ticket.version,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
    })

    res.status(201).send(ticket)
  }
)

export { router as createTicketRouter }
