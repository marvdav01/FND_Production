import express from 'express'
import { authenticate, authorize } from '../middlewares/auth.js'
import { fetchEquipment, getEquipment, createEquipment, updateEquipment, deleteEquipment } from '../controllers/equipmentController.js'

const router = express.Router()

router.use(authenticate)
router.get('/', fetchEquipment)
router.get('/:id', getEquipment)
router.post('/', authorize('admin'), createEquipment)
router.put('/:id', authorize('admin'), updateEquipment)
router.delete('/:id', authorize('admin'), deleteEquipment)

export default router
