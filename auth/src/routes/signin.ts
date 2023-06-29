import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import jwt from 'jsonwebtoken'
import { BadRequestError } from '@jpticketing/common'

import { validateRequest } from '@jpticketing/common'
import { User } from '../models/user'
import { Password } from '../services/password'
const router = express.Router()

router.post(
  '/api/users/signin',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password').trim().notEmpty().withMessage('You must input password'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body
    const existingUser = await User.findOne({ email })

    if (!existingUser) throw new BadRequestError('Invalid credentials')
    const isPwdMatch = await Password.compare(existingUser.password, password)
    if (!isPwdMatch) throw new BadRequestError('Invalid credentials')

    //generate jwt
    const userJwt = jwt.sign(
      { id: existingUser.id, email },
      process.env.JWT_KEY!
    )
    //store it on session object
    req.session = {
      jwt: userJwt,
    }

    res.status(200).send(existingUser)
  }
)
export { router as signinRouter }
