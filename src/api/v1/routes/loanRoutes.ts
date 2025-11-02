import express from "express";
import {
  createLoan,
  reviewLoan,
  getAllLoans,
  approveLoan
} from "../controllers/loanController";

const router = express.Router();

// POST /api/v1/loans (Role: user)
router.post("/", createLoan);

// PUT /api/v1/loans/:id/review (Role: officer)
router.put("/:id/review", reviewLoan);

// GET /api/v1/loans (Role: officer, manager)
router.get("/", getAllLoans);

// PUT /api/v1/loans/:id/approve (Role: manager)
router.put("/:id/approve", approveLoan);

export default router;