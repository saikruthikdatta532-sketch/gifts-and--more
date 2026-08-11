import { Request, Response } from "express";
import * as revenueService from "../services/revenue.service";
import { logActivity } from "../services/activityLog.service";

export async function getRevenue(_req: Request, res: Response) {
  const revenue = await revenueService.listRevenue();
  const summary = await revenueService.getRevenueSummary();
  res.json({ revenue, summary });
}

export async function postRevenue(req: Request, res: Response) {
  const revenue = await revenueService.createRevenue(req.body);
  const user = req.user as { id: string };

  await logActivity({
    userId: user.id,
    action: "REVENUE_RECORDED",
    entityType: "Revenue",
    entityId: revenue.id,
    metadata: { amount: revenue.amount.toString() },
  });

  res.status(201).json({ revenue });
}

export async function putRevenue(req: Request, res: Response) {
  const revenue = await revenueService.updateRevenue(req.params.id, req.body);
  res.json({ revenue });
}
