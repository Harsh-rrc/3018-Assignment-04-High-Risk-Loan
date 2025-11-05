import express from "express";
import { createLoan, reviewLoan, getAllLoans, approveLoan } from "../controllers/loanController";
import authenticate from "../middleware/authenticate";
import { authorize } from "../middleware/authorization";

const router = express.Router();

// POST /api/v1/loans (Role: user)
router.post("/", authenticate, authorize({ roles: ["user"] }), createLoan);

// PUT /api/v1/loans/:id/review (Role: officer)
router.put("/:id/review", authenticate, authorize({ roles: ["officer"] }), reviewLoan);

// GET /api/v1/loans (Role: officer, manager)
router.get("/", authenticate, authorize({ roles: ["officer", "manager"] }), getAllLoans);

// PUT /api/v1/loans/:id/approve (Role: manager)
router.put("/:id/approve", authenticate, authorize({ roles: ["manager"] }), approveLoan);

export default router;