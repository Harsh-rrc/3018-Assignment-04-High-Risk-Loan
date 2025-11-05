import { Request, Response } from "express";

// In-memory loan storage for demonstration purposes
interface Loan {
  id: number;
  applicant: string;
  amount: number;
}

let loans: Loan[] = [];
let nextId = 1;

export const createLoan = (req: Request, res: Response) => {
  const { applicant, amount } = req.body;
  const newLoan: Loan = { id: nextId++, applicant, amount };
  loans.push(newLoan);
  res.status(201).json(newLoan);
};

export const reviewLoan = (req: Request, res: Response) => {
  res.json({ message: `Loan ${req.params.id} reviewed successfully (Role: officer)` });
};

export const getAllLoans = (req: Request, res: Response) => {
  res.json(loans);
};

export const approveLoan = (req: Request, res: Response) => {
  res.json({ message: `Loan ${req.params.id} approved successfully (Role: manager)` });
};