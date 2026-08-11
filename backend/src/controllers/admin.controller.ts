import { Request, Response } from "express";
import * as adminService from "../services/admin.service";

export async function getDashboard(_req: Request, res: Response) {
  const metrics = await adminService.getDashboardMetrics();
  res.json({ metrics });
}

export async function getLogs(req: Request, res: Response) {
  const page = parseInt((req.query.page as string) ?? "1", 10);
  const limit = parseInt((req.query.limit as string) ?? "20", 10);
  const result = await adminService.getActivityLogs(page, limit);
  res.json(result);
}
