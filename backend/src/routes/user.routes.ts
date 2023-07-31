import express from 'express';
import { UserController } from '../controllers';

const router = express.Router();

router.post('/', UserController.create);
router.get('/all', UserController.all);
router.post('/remove', UserController.remove);
router.post('/edit', UserController.update);
router.get('/:id', UserController.getDetails);

export default router