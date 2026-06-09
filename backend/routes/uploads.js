import express from 'express'
import { uploadImages } from '../controllers/uploadsController.js'
import { authenticate, authorize } from '../middlewares/auth.js'
import { imageUpload } from '../middlewares/upload.js'

const router = express.Router()

router.use(authenticate)
router.post('/images', authorize('admin', 'client'), imageUpload.array('images', 10), uploadImages)

export default router
