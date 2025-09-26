"use server";

import { auth } from "@/auth";
import { prisma } from "@/db/prisma";
import { CartItem } from "@/types";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { mapToPlainObj } from "../utils";
import { createOrderSchema } from "../validators";
import { getMyCart } from "./cart.action";
import { getUserById } from "./user.action";

export async function createOrder() {
  try {
    const session = await auth();
    if (!session) throw new Error("User is not authenticated");

    const cart = await getMyCart();
    const userId = session?.user?.id;
    if (!userId) throw new Error("User not found");

    const user = await getUserById(userId);

    if (!cart || cart.items.length === 0) {
      return {
        success: false,
        message: "your cart is empty",
        redirectTo: "/cart",
      };
    }

    if (!user.address) {
      return {
        success: false,
        message: "no shipping address",
        redirectTo: "/shipping-address",
      };
    }

    if (!user.paymentMethod) {
      return {
        success: false,
        message: "no payment method",
        redirectTo: "/payment-method",
      };
    }

    // create order object
    const order = createOrderSchema.parse({
      userId: user.id,
      shippingAddress: user.address,
      paymentMethod: user.paymentMethod,
      itemsPrice: cart.itemsPrice,
      shippingPrice: cart.shippingPrice,
      taxPrice: cart.taxPrice,
      totalPrice: cart.totalPrice,
    });

    // transaction create order and order item
    const cratedOrderId = await prisma.$transaction(async (tx) => {
      // create order
      const newOrder = await tx.order.create({ data: order });

      // create order items from the cart items
      for (const item of cart.items as CartItem[]) {
        await tx.orderItem.create({
          data: {
            ...item,
            price: item.price,
            orderId: newOrder.id,
          },
        });
      }

      // clear cart
      await tx.cart.update({
        where: { id: cart.id },
        data: {
          items: [],
          totalPrice: 0,
          taxPrice: 0,
          shippingPrice: 0,
          itemsPrice: 0,
        },
      });
      return newOrder.id;
    });
    if (!cratedOrderId) throw new Error("Order not created");

    return {
      success: true,
      message: "order crated",
      redirectTo: `/order/${cratedOrderId}`,
    };
  } catch (error) {
    if (isRedirectError(error)) throw error;

    return { success: false, message: "user was not created" };
  }
}

export async function getOrderById(orderId: string) {
  const data = await prisma.order.findFirst({
    where: {
      id: orderId,
    },
    include: {
      OrderItem: true,
      user: { select: { name: true, email: true } },
    },
  });
  return mapToPlainObj(data);
}
