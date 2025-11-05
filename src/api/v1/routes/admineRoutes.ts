import express from "express";
import { someAdminFunction } from "../controllers/adminController";
import authenticate from "../middleware/authenticate";
import { authorize } from "../middleware/authorization";

const router = express.Router();

// Example admin route - requires manager role
router.get("/dashboard", authenticate, authorize({ roles: ["manager"] }), someAdminFunction);

export default router;
