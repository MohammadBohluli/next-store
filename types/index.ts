import {
  cartItemSchema,
  createCartSchema,
  createProductSchema,
} from "@/lib/validators";
import { z } from "zod";

export type Product = z.infer<typeof createProductSchema> & {
  id: string;
  rating: string;
  createdAt: Date;
};

export type Cart = z.infer<typeof createCartSchema>;
export type CartItem = z.infer<typeof cartItemSchema>;
