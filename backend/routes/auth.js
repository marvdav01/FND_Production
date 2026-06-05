import express from 'express'
import { login, signup, profile, updateProfile, uploadAvatar, uploadAvatarBase64, getUsers } from '../controllers/authController.js'
import { authenticate } from '../middlewares/auth.js'
import { validate } from '../middlewares/validate.js'
import { loginSchema, signupSchema } from '../utils/schemas.js'
import { upload } from '../middlewares/upload.js'

const router = express.Router()

router.post('/login', validate(loginSchema), login)
router.post('/signup', validate(signupSchema), signup)
router.get('/profile', authenticate, profile)
router.put('/profile', authenticate, updateProfile)
router.post('/profile/avatar', authenticate, upload.single('avatar'), uploadAvatar)
router.post('/profile/avatar-base64', authenticate, uploadAvatarBase64)
router.get('/users', authenticate, getUsers)
router.post('/logout', (req, res) => res.json({ success: true, message: 'Logged out' }))

export default router
