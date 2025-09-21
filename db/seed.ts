import sampleData from "@/db/sample-data";
import { PrismaClient } from "@prisma/client";

// how to run: `npx tsx ./db/seed`
async function main() {
  const client = new PrismaClient();
  await client.product.deleteMany();
  await client.product.createMany({ data: sampleData.products });

  console.log("✅ Database seeded successfully");
}

main();
