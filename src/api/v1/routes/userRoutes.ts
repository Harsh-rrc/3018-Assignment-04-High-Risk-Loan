import express from 'express';
import { setCustomUserClaims, getCustomUserClaims } from '../controllers/userController';

const router = express.Router();

router.post('/set-user-claims', setCustomUserClaims);
router.get('/get-claims/:uid', getCustomUserClaims);

export default router;
