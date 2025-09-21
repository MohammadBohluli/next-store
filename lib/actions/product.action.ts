import { prisma } from "@/db/prisma";
import { LATEST_PRODUCTS_LIMIT } from "../constants";
import { mapToPlainObj } from "../utils";

export async function getLatestProducts() {
  // const db = new PrismaClient();

  const data = await prisma.product.findMany({
    take: LATEST_PRODUCTS_LIMIT,
    orderBy: { createdAt: "desc" },
  });

  return mapToPlainObj(data);
}
