import sampleData from "@/db/sample-data";
import { PrismaClient } from "@prisma/client";

// how to run: `npx tsx ./db/seed`
async function main() {
  const client = new PrismaClient();
  await client.product.deleteMany();
  await client.account.deleteMany();
  await client.session.deleteMany();
  await client.verificationToken.deleteMany();
  await client.user.deleteMany();

  await client.product.createMany({ data: sampleData.products });
  await client.user.createMany({ data: sampleData.users });

  console.log("✅ Database seeded successfully");
}

main();
