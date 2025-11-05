import { Request, Response, NextFunction } from "express";
import { successResponse } from "../models/responseModel";

// Example admin controller function
export const someAdminFunction = (req: Request, res: Response, next: NextFunction): void => {
    try {
        res.json(successResponse({ message: "Admin dashboard accessed" }));
    } catch (error) {
        next(error);
    }
};