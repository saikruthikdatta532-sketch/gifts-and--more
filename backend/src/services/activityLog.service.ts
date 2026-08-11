import { prisma } from "../utils/prisma";
import { logger } from "../utils/logger";
import { ActivityAction } from "@prisma/client";

interface LogActivityParams {
  userId: string;
  action: ActivityAction;
  entityType: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
}

export async function logActivity(params: LogActivityParams): Promise<void> {
  try {
    await prisma.activityLog.create({
      data: {
        userId: params.userId,
        action: params.action,
        entityType: params.entityType,
        entityId: params.entityId,
        metadata: params.metadata,
      },
    });
  } catch (err) {
    // Activity logging should never break the main request flow
    logger.error("Failed to write activity log", err);
  }
}
