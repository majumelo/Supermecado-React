import express from 'express';
import equipmentController from '../controllers/equipment-controller.js';

const router = express.Router();

router.route('/')
.get(equipmentController.getAll)
.post(equipmentController.create);

router.route('/:id')
.get(equipmentController.getOne)
.delete(equipmentController.deleteOne)
.put(equipmentController.editOne);

router.route('/:id/discount')
.put(equipmentController.applyDiscount)
.delete(equipmentController.removeDiscount);

export default router;
