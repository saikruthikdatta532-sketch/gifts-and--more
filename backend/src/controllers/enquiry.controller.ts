import { Request, Response } from "express";
import * as enquiryService from "../services/enquiry.service";
import { logActivity } from "../services/activityLog.service";

export async function getEnquiries(req: Request, res: Response) {
  const result = await enquiryService.listEnquiries(req.query as never);
  res.json(result);
}

export async function postEnquiry(req: Request, res: Response) {
  // Public endpoint — anyone can submit an enquiry, no login required.
  const enquiry = await enquiryService.createEnquiry(req.body);
  res.status(201).json({ enquiry });
}

export async function putEnquiry(req: Request, res: Response) {
  const enquiry = await enquiryService.updateEnquiry(req.params.id, req.body);
  const user = req.user as { id: string };

  await logActivity({
    userId: user.id,
    action: "ENQUIRY_UPDATED",
    entityType: "Enquiry",
    entityId: enquiry.id,
    metadata: { status: enquiry.status },
  });

  res.json({ enquiry });
}
