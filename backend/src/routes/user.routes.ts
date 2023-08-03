import express from 'express';
import { UserController } from '../controllers';
import { MiddleWare } from '../middlewares';

const router = express.Router();

router.post('/', MiddleWare.verifyAdminJwt, UserController.create);
router.get('/all', UserController.all);
router.post('/remove', MiddleWare.verifyAdminJwt, UserController.remove);
router.post('/edit', MiddleWare.verifyAdminJwt, UserController.update);
router.post('/admin/verify', UserController.verifyAdmin);
router.post('/creator/verify', UserController.verifyCreator);
router.get('/nonce', UserController.getNonce);

export default router