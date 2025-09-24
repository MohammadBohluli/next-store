"use server";

import { auth } from "@/auth";
import { prisma } from "@/db/prisma";
import type { CartItem } from "@/types";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { calcPrice, mapToPlainObj } from "../utils";
import { cartItemSchema, createCartSchema } from "../validators";

export async function addItemToCart(data: CartItem) {
  try {
    // check and get cart cookie
    const sessionCartId = (await cookies()).get("sessionCartId")?.value;
    if (!sessionCartId) throw new Error("Cart session not founded");

    // get session and user id
    const session = await auth();
    const userId = session?.user?.id ? (session.user.id as string) : undefined;

    // Get cart
    const cart = await getMyCart();

    //parse and validate item
    const item = cartItemSchema.parse(data);

    // find product in databse
    const prodcut = await prisma.product.findFirst({
      where: { id: item.productId },
    });
    if (!prodcut) throw new Error("Product not founded");

    if (!cart) {
      const newCart = createCartSchema.parse({
        userId: userId,
        items: [item],
        sessionCartId: sessionCartId,
        ...calcPrice([item]),
      });

      await prisma.cart.create({ data: newCart });
      revalidatePath(`/products/${prodcut.slug}`);
      return { success: true, message: `Item ${prodcut.name} add to cart` };
    } else {
      // check item is already in cart
      const isExistItem = cart.items.find(
        (itm) => itm.productId === item.productId
      );
      if (isExistItem) {
        if (prodcut.stock < isExistItem.qty + 1) {
          throw new Error("Not enough stock");
        }
        cart.items = cart.items.map((itm) =>
          itm.productId === item.productId ? { ...itm, qty: itm.qty + 1 } : itm
        );
      } else {
        // if item does not exist in cart
        // check stock
        if (prodcut.stock < 1) {
          throw new Error("Not enough stock");
        }
        // add item to the cart.items
        cart.items.push(item);
      }

      // save to database
      await prisma.cart.update({
        where: { id: cart.id },
        data: { items: cart.items, ...calcPrice(cart.items) },
      });
      revalidatePath(`/products/${prodcut.slug}`);

      return {
        success: false,
        message: ` ${prodcut.name} ${
          isExistItem ? "update cart" : "add to cart"
        }`,
      };
    }
  } catch (error) {
    return { success: false, message: "Item add to cart" };
  }
}

export async function getMyCart() {
  // check and get cart cookie
  const sessionCartId = (await cookies()).get("sessionCartId")?.value;
  if (!sessionCartId) throw new Error("Cart session not founded");

  // get session and user id
  const session = await auth();
  const userId = session?.user?.id ? (session.user.id as string) : undefined;

  // Get user cart from database
  const cart = await prisma.cart.findFirst({
    where: userId ? { userId: userId } : { sessionCartId: sessionCartId },
  });

  if (!cart) return undefined;

  // convert decimal and return
  return mapToPlainObj({
    ...cart,
    items: cart.items as CartItem[],
    itemsPrice: cart.itemsPrice.toString(),
    totalPrice: cart.totalPrice.toString(),
    shippingPrice: cart.shippingPrice.toString(),
    taxPrice: cart.taxPrice.toString(),
  });
}

export async function removeItemFromCart(productId: string) {
  try {
    // Get session cart id
    const sessionCartId = (await cookies()).get("sessionCartId")?.value;
    if (!sessionCartId) throw new Error("Cart Session not found");

    // Get product
    const product = await prisma.product.findFirst({
      where: { id: productId },
    });
    if (!product) throw new Error("Product not found");

    // Get user cart
    const cart = await getMyCart();
    if (!cart) throw new Error("Cart not found");

    // Check if cart has item
    const exist = cart.items.find((x) => x.productId === productId);
    if (!exist) throw new Error("Item not found");

    // Check if cart has only one item
    if (exist.qty === 1) {
      // Remove item from cart
      cart.items = cart.items.filter((x) => x.productId !== exist.productId);
    } else {
      // Decrease quantity of existing item
      cart.items.find((x) => x.productId === productId)!.qty = exist.qty - 1;
    }

    // Update cart in database
    await prisma.cart.update({
      where: { id: cart.id },
      data: {
        items: cart.items,
        ...calcPrice(cart.items),
      },
    });

    // Revalidate product page
    revalidatePath(`/products/${product.slug}`);

    return {
      success: true,
      message: `${product.name}  ${
        cart.items.find((x) => x.productId === productId)
          ? "updated in"
          : "removed from"
      } cart successfully`,
    };
  } catch (error) {
    return { success: false, message: "item was not remove from cart" };
  }
}
