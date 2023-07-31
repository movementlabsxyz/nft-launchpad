import { Router } from 'express';
import CollectionRoute from './collection.routes';
import UserRoute from './user.routes';

const router = Router();
router.use('/collection', CollectionRoute)
router.use('/user', UserRoute)

export default router