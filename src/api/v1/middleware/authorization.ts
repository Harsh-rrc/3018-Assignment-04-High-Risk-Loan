import { Request, Response, NextFunction } from "express";
import { AuthorizationError } from "../errors/errors";
import { AuthzOptions } from "../models/authorizationOption";

// Authorization middleware
export function authorize(options: AuthzOptions = {}) {
  const { roles = [], allowSameUser = false, idParam } = options;

  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = { uid: res.locals.uid, role: res.locals.role };
      if (!user.uid) {
        return next(new AuthorizationError("Not authenticated"));
      }

      if (roles.length === 0) {
        return next();
      }

      if (user.role && roles.includes(user.role)) {
        return next();
      }

      if (allowSameUser) {
        const paramToCheck = idParam ?? (req.params?.userId ? "userId" : (req.params?.id ? "id" : undefined));
        if (paramToCheck && req.params && req.params[paramToCheck] && req.params[paramToCheck] === user.uid) {
          return next();
        }
      }

      return next(new AuthorizationError("Forbidden: insufficient role"));
    } catch (err) {
      return next(new AuthorizationError("Forbidden"));
    }
  };
}