import { createProductSchema } from "@/lib/validators";
import { z } from "zod";

export type Product = z.infer<typeof createProductSchema> & {
  id: string;
  rating: string;
  createdAt: Date;
};
