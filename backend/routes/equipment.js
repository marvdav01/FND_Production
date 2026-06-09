import express from 'express'
import { authenticate, authorize } from '../middlewares/auth.js'
import { fetchEquipment, getEquipment, createEquipment, updateEquipment, deleteEquipment } from '../controllers/equipmentController.js'
import { validate } from '../middlewares/validate.js'
import { equipmentSchema, updateEquipmentSchema } from '../utils/schemas.js'

const router = express.Router()

router.use(authenticate)
router.get('/', fetchEquipment)
router.get('/:id', getEquipment)
router.post('/', authorize('admin'), validate(equipmentSchema), createEquipment)
router.put('/:id', authorize('admin'), validate(updateEquipmentSchema), updateEquipment)
router.delete('/:id', authorize('admin'), deleteEquipment)

export default router
