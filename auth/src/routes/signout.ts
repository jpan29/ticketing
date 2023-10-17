import express from 'express'

const router = express.Router()
//signout route
router.post('/api/users/signout', (req, res) => {
  req.session = null
  res.send({})
})
export { router as signoutRouter }
