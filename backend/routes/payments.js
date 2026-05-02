import express from 'express'
import { authenticate, authorize } from '../middleware/auth.js'
import { fetchPayments, createPayment, updatePayment, getPayment } from '../controllers/paymentsController.js'

const router = express.Router()

router.use(authenticate)
router.get('/', authorize('admin'), fetchPayments)
router.get('/:id', getPayment)
router.post('/', authorize('admin'), createPayment)
router.put('/:id', authorize('admin'), updatePayment)

export default router
