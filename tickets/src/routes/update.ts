import {
  BadRequestError,
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
  validateRequest,
} from '@jpticketing/common'
import { body } from 'express-validator'
import express, { Request, Response } from 'express'
import { Ticket } from '../models/ticket'
import { TicketUpdatedPubliser } from '../events/publishers/ticket-updated-publisher'
import { natsWrapper } from '../nats-wrapper'

const router = express.Router()

router.patch(
  '/api/tickets/:id',
  requireAuth,
  [
    body('title').not().isEmpty().withMessage('Title can not be empty'),
    body('price')
      .isFloat({ gt: 0 })
      .withMessage('Price should be greater than 0'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const ticket = await Ticket.findById({ _id: req.params.id })
    if (!ticket) throw new NotFoundError()
    if (ticket.orderId) throw new BadRequestError('Ticket is reserved')
    if (req.currentUser!.id !== ticket.userId) throw new NotAuthorizedError()

    ticket.set({
      title: req.body.title,
      price: req.body.price,
    })
    await ticket.save()
    new TicketUpdatedPubliser(natsWrapper.client).publish({
      id: ticket.id,
      version: ticket.version,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
    })
    res.status(200).send(ticket)
  }
)

export { router as updateTicketRouter }
