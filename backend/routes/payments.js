import express from 'express'
import { authenticate, authorize } from '../middlewares/auth.js'
import { fetchPayments, createPayment, updatePayment, getPayment, uploadProof } from '../controllers/paymentsController.js'
import { upload } from '../middlewares/upload.js'
import { validate } from '../middlewares/validate.js'
import { paymentSchema } from '../utils/schemas.js'

const router = express.Router()

router.use(authenticate)
router.get('/', authorize('admin'), fetchPayments)
router.get('/:id', authorize('admin'), getPayment)
router.post('/', authorize('admin'), validate(paymentSchema), createPayment)
router.put('/:id', authorize('admin'), validate(paymentSchema), updatePayment)
router.post('/:id/upload-proof', authorize('admin', 'client'), upload.single('proof'), uploadProof)

export default router
