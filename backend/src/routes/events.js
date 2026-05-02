import express from 'express'
import { authenticate, authorize } from '../middleware/auth.js'
import { fetchEvents, getEvent, createEvent, updateEvent, deleteEvent, updateStatus } from '../controllers/eventsController.js'

const router = express.Router()

router.use(authenticate)
router.get('/', fetchEvents)
router.get('/:id', getEvent)
router.post('/', authorize('admin','client'), createEvent)
router.put('/:id', authorize('admin','client'), updateEvent)
router.delete('/:id', authorize('admin'), deleteEvent)
router.patch('/:id/status', authorize('admin'), updateStatus)

export default router
