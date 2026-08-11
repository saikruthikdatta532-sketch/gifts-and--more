import { Request, Response } from "express";
import * as categoryService from "../services/category.service";
import { logActivity } from "../services/activityLog.service";

export async function getCategories(_req: Request, res: Response) {
  const categories = await categoryService.listCategories();
  res.json({ categories });
}

export async function postCategory(req: Request, res: Response) {
  const category = await categoryService.createCategory(req.body);
  const user = req.user as { id: string };

  await logActivity({
    userId: user.id,
    action: "CATEGORY_CREATED",
    entityType: "Category",
    entityId: category.id,
    metadata: { name: category.name },
  });

  res.status(201).json({ category });
}

export async function putCategory(req: Request, res: Response) {
  const category = await categoryService.updateCategory(req.params.id, req.body);
  const user = req.user as { id: string };

  await logActivity({
    userId: user.id,
    action: "CATEGORY_UPDATED",
    entityType: "Category",
    entityId: category.id,
  });

  res.json({ category });
}

export async function deleteCategoryHandler(req: Request, res: Response) {
  const category = await categoryService.deleteCategory(req.params.id);
  const user = req.user as { id: string };

  await logActivity({
    userId: user.id,
    action: "CATEGORY_DELETED",
    entityType: "Category",
    entityId: category.id,
    metadata: { name: category.name },
  });

  res.json({ success: true });
}
