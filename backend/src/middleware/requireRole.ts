import { Request, Response, NextFunction } from "express";
import { AppError } from "./errorHandler";

export function requireRole(...allowedRoles: Array<"USER" | "ADMIN">) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const user = req.user as { role?: string } | undefined;

    if (!user) {
      return next(new AppError("Authentication required", 401));
    }

    if (!user.role || !allowedRoles.includes(user.role as "USER" | "ADMIN")) {
      return next(new AppError("Insufficient permissions", 403));
    }

    next();
  };
}
