import express from 'express';
import { UserController } from '../controllers';
import { MiddleWare } from '../middlewares';

const router = express.Router();

router.post('/', MiddleWare.verifyAdmin, UserController.create);
router.get('/all', MiddleWare.verifyAdmin, UserController.all);
router.post('/remove', MiddleWare.verifyAdmin, UserController.remove);
router.post('/edit', MiddleWare.verifyAdmin, UserController.update);
router.post('/admin/verify', MiddleWare.verifyAdmin, UserController.verifyAdmin);
router.post('/creator/verify', MiddleWare.verifyAdmin, UserController.verifyCreator);
router.get('/nonce', MiddleWare.verifyAdmin, UserController.getNonce);

export default router