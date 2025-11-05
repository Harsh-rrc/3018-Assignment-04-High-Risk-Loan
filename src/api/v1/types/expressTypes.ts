import { NextFunction, Request, Response, } from 'express';

// Type definition for Express middleware functions
export type MiddlewareFunction = (
  req: Request,
  res: Response,
  next: NextFunction
) => void;