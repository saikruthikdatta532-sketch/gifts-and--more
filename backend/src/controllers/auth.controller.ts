import { Request, Response } from "express";
import { logActivity } from "../services/activityLog.service";

export async function getMe(req: Request, res: Response) {
  if (!req.user) {
    return res.status(200).json({ user: null });
  }

  const user = req.user as {
    id: string;
    name: string;
    email: string;
    image: string | null;
    role: string;
  };

  return res.status(200).json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      role: user.role,
    },
  });
}

export async function logout(req: Request, res: Response) {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: "Logout failed" });
    }
    req.session.destroy(() => {
      res.clearCookie("connect.sid");
      res.status(200).json({ success: true });
    });
  });
}

export async function googleCallbackHandler(req: Request, res: Response) {
  const user = req.user as { id: string; role: string } | undefined;

  if (user?.role === "ADMIN") {
    await logActivity({
      userId: user.id,
      action: "ADMIN_LOGIN",
      entityType: "User",
      entityId: user.id,
    });
  }

  const { env } = await import("../config/env");
  res.redirect(env.FRONTEND_URL);
}
