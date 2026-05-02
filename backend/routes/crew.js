import express from 'express'
import { authenticate, authorize } from '../middleware/auth.js'
import { fetchCrew, getCrew, createCrew, updateCrew, deleteCrew, assignCrew } from '../controllers/crewController.js'

const router = express.Router()

router.use(authenticate)
router.get('/', fetchCrew)
router.get('/:id', getCrew)
router.post('/', authorize('admin'), createCrew)
router.put('/:id', authorize('admin'), updateCrew)
router.delete('/:id', authorize('admin'), deleteCrew)
router.post('/:id/assign', authorize('admin'), assignCrew)

export default router
