import express from 'express'
import { authenticate, authorize } from '../middlewares/auth.js'
import { fetchCrew, getCrew, createCrew, updateCrew, deleteCrew, assignCrew, registerCrewAccount, unassignCrew } from '../controllers/crewController.js'
import { validate } from '../middlewares/validate.js'
import { crewSchema, registerCrewSchema, updateCrewSchema } from '../utils/schemas.js'

const router = express.Router()

router.use(authenticate)
router.get('/', fetchCrew)
router.post('/', authorize('admin'), validate(crewSchema), createCrew)
router.post('/register', authorize('admin'), validate(registerCrewSchema), registerCrewAccount)
router.get('/:id', getCrew)
router.put('/:id', authorize('admin'), validate(updateCrewSchema), updateCrew)
router.delete('/:id', authorize('admin'), deleteCrew)
router.post('/:id/assign', authorize('admin'), assignCrew)
router.delete('/:id/assign/:crewId', authorize('admin'), unassignCrew)


export default router
