import { getMyCart } from "@/lib/actions/cart.action";
import { Metadata } from "next";
import CartTable from "./cart-table";

export const metadata: Metadata = { title: "Shopping Cart" };

const CartPage = async () => {
  const cart = await getMyCart();
  return (
    <>
      <CartTable cart={cart} />
    </>
  );
};

export default CartPage;
