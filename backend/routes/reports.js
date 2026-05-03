import express from 'express'
import { authenticate, authorize } from '../middlewares/auth.js'
import { exportEventsExcel, exportEventsPDF } from '../controllers/reportsController.js'

const router = express.Router()

router.use(authenticate)
router.use(authorize('admin'))

router.get('/export/excel', exportEventsExcel)
router.get('/export/pdf', exportEventsPDF)

export default router
