"use server";

import type { CartItem } from "@/types";

export async function addItemToCart(data: CartItem) {
  return { success: false, message: "Item add to cart" };
}
