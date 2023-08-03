import express from 'express';
import { CollectionController } from '../controllers';
import { MiddleWare } from '../middlewares';

const router = express.Router();

router.post('/', MiddleWare.verifyCreatorJwt, CollectionController.create);
router.post('/nft/name', CollectionController.get_nft_name);
router.get('/all', CollectionController.all);
router.get('/:id', CollectionController.getDetails);


export default router