import express from 'express'
import { login, signup, profile, getUsers } from '../controllers/authController.js'
import { authenticate } from '../middlewares/auth.js'
import { validate } from '../middlewares/validate.js'
import { loginSchema, signupSchema } from '../utils/schemas.js'

const router = express.Router()

router.post('/login', validate(loginSchema), login)
router.post('/signup', validate(signupSchema), signup)
router.get('/profile', authenticate, profile)
router.get('/users', authenticate, getUsers)
router.post('/logout', (req, res) => res.json({ success: true, message: 'Logged out' }))

export default router
