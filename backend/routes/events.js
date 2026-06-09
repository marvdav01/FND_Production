import express from 'express'
import { authenticate, authorize } from '../middlewares/auth.js'
import { fetchEvents, getEvent, createEvent, updateEvent, deleteEvent, updateStatus, getAssignedEvents } from '../controllers/eventsController.js'
import { validate } from '../middlewares/validate.js'
import { eventSchema, statusSchema } from '../utils/schemas.js'

const router = express.Router()

router.use(authenticate)
router.get('/assigned', authorize('crew'), getAssignedEvents)
router.get('/', fetchEvents)
router.get('/:id', getEvent)
router.post('/', authorize('admin','client'), validate(eventSchema), createEvent)
router.put('/:id', authorize('admin','client'), validate(eventSchema), updateEvent)
router.delete('/:id', authorize('admin'), deleteEvent)
router.put('/:id/status', authorize('admin'), validate(statusSchema), updateStatus)

export default router
