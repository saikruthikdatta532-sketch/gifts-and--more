import { Request, Response } from "express";
import * as productService from "../services/product.service";
import { logActivity } from "../services/activityLog.service";

export async function getProducts(req: Request, res: Response) {
  const result = await productService.listProducts(req.query as never);
  res.json(result);
}

export async function getProductBySlug(req: Request, res: Response) {
  const product = await productService.getProductBySlug(req.params.slug);
  res.json({ product });
}

export async function postProduct(req: Request, res: Response) {
  const product = await productService.createProduct(req.body);
  const user = req.user as { id: string };

  await logActivity({
    userId: user.id,
    action: "PRODUCT_CREATED",
    entityType: "Product",
    entityId: product.id,
    metadata: { name: product.name },
  });

  res.status(201).json({ product });
}

export async function putProduct(req: Request, res: Response) {
  const product = await productService.updateProduct(req.params.id, req.body);
  const user = req.user as { id: string };

  await logActivity({
    userId: user.id,
    action: "PRODUCT_UPDATED",
    entityType: "Product",
    entityId: product.id,
  });

  res.json({ product });
}

export async function patchStock(req: Request, res: Response) {
  const product = await productService.updateStock(req.params.id, req.body.stockQuantity);
  const user = req.user as { id: string };

  await logActivity({
    userId: user.id,
    action: "STOCK_UPDATED",
    entityType: "Product",
    entityId: product.id,
    metadata: { newStock: product.stockQuantity },
  });

  res.json({ product });
}

export async function deleteProductHandler(req: Request, res: Response) {
  const product = await productService.deleteProduct(req.params.id);
  const user = req.user as { id: string };

  await logActivity({
    userId: user.id,
    action: "PRODUCT_DELETED",
    entityType: "Product",
    entityId: product.id,
    metadata: { name: product.name },
  });

  res.json({ success: true });
}
