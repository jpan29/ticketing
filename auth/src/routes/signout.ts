import express from 'express'

const router = express.Router()
//testv3
//testv3
router.post('/api/users/signout', (req, res) => {
  req.session = null
  res.send({})
})
export { router as signoutRouter }
