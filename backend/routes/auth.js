import express from 'express'
import { login, signup, profile } from '../controllers/authController.js'
import { authenticate } from '../middleware/auth.js'

const router = express.Router()

router.post('/login', login)
router.post('/signup', signup)
router.get('/profile', authenticate, profile)
router.post('/logout', (req, res) => res.json({ success: true, message: 'Logged out' }))

export default router
