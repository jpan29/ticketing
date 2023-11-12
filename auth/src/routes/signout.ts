import express from 'express'

const router = express.Router()
//testv3
router.post('/api/users/signout', (req, res) => {
  req.session = null
  res.send({})
})
//testv3
export { router as signoutRouter }
