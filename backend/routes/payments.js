import express from 'express'
import { authenticate, authorize } from '../middlewares/auth.js'
import { fetchPayments, createPayment, updatePayment, getPayment, uploadProof } from '../controllers/paymentsController.js'
import { proofUpload } from '../middlewares/upload.js'
import { validate } from '../middlewares/validate.js'
import { paymentSchema, updatePaymentSchema } from '../utils/schemas.js'

const router = express.Router()

router.use(authenticate)
router.get('/', authorize('admin'), fetchPayments)
router.get('/:id', authorize('admin'), getPayment)
router.post('/', authorize('admin'), validate(paymentSchema), createPayment)
router.put('/:id', authorize('admin'), validate(updatePaymentSchema), updatePayment)
router.post('/:id/upload-proof', authorize('admin', 'client'), proofUpload.single('proof'), uploadProof)

export default router
