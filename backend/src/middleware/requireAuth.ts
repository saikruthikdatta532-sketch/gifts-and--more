import { Request, Response, NextFunction } from "express";
import { AppError } from "./errorHandler";

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  if (!req.isAuthenticated || !req.isAuthenticated() || !req.user) {
    return next(new AppError("Authentication required", 401));
  }
  next();
}
