import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import jwt from 'jsonwebtoken'
import { BadRequestError } from '@jpticketing/common'

import { validateRequest } from '@jpticketing/common'
import { User } from '../models/user'
const router = express.Router()

router.post(
  '/api/users/signup',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
      .isLength({ min: 4, max: 20 })
      .withMessage('Password must between 4 and 20 characters'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body
    const existingUser = await User.findOne({ email: email })

    if (existingUser) {
      throw new BadRequestError('Email in use')
    }

    const user = User.build({ email, password })
    await user.save()

    //generate jwt
    const userJwt = jwt.sign({ id: user.id, email }, process.env.JWT_KEY!)
    //store it on session object
    req.session = {
      jwt: userJwt,
    }

    res.status(201).send(user)
  }
)
export { router as signupRouter }