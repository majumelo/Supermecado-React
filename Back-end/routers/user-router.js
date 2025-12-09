import express from 'express';
import userController from '../controllers/user-controller.js';

const router = express.Router();

router.route('/')
.get(userController.getAll)
.post(userController.create);

router.route('/:id')
.get(userController.getOne)
.delete(userController.deleteOne)
.put(userController.editOne);

router.post('/login', userController.login);

export default router;