import express from 'express';
import { setCustomUserClaims, getCustomUserClaims } from '../controllers/userController';
import authenticate from '../middleware/authenticate';
import { authorize } from '../middleware/authorization';

const router = express.Router();

// Admin-only routes for managing user claims
router.post('/set-user-claims', authenticate, authorize({ roles: ["manager"] }), setCustomUserClaims);
router.get('/get-claims/:uid', authenticate, authorize({ roles: ["manager"] }), getCustomUserClaims);

export default router;