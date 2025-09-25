import {
  cartItemSchema,
  createCartSchema,
  createProductSchema,
  paymentMethodSchema,
  shippingAddressSchema,
} from "@/lib/validators";
import { z } from "zod";

export type Product = z.infer<typeof createProductSchema> & {
  id: string;
  rating: string;
  createdAt: Date;
};

export type Cart = z.infer<typeof createCartSchema>;
export type CartItem = z.infer<typeof cartItemSchema>;
export type ShippingAddress = z.infer<typeof shippingAddressSchema>;
export type PaymentMethod = z.infer<typeof paymentMethodSchema>;
