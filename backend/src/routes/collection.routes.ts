import express from 'express';
import { CollectionController } from '../controllers';

const router = express.Router();

router.post('/', CollectionController.create);
router.get('/all', CollectionController.all);
router.get('/:id', CollectionController.getDetails);

export default router