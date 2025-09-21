import { LATEST_PRODUCTS_LIMIT } from "../constants";
import { PrismaClient } from "../generated/prisma";
import { mapToPlainObj } from "../utils";

export async function getLatestProducts() {
  const db = new PrismaClient();

  const data = await db.product.findMany({
    take: LATEST_PRODUCTS_LIMIT,
    orderBy: { createdAt: "desc" },
  });

  return mapToPlainObj(data);
}
