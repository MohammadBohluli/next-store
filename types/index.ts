import {
  cartItemSchema,
  createCartSchema,
  createOrderItemSchema,
  createOrderSchema,
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
export type OrderItem = z.infer<typeof createOrderItemSchema>;
export type Order = z.infer<typeof createOrderSchema> & {
  id: string;
  createdAt: Date;
  isPaid: Boolean;
  paidAt: Date | null;
  isDelivered: Boolean;
  deliveredAt: Date | null;
  orderItems: OrderItem[];
  user: { name: string; email: string };
};
