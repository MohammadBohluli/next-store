import { auth } from "@/auth";
import { getMyCart } from "@/lib/actions/cart.action";
import { getUserById } from "@/lib/actions/user.action";
import { type ShippingAddress } from "@/types";
import { redirect } from "next/navigation";
import { Metadata } from "next/types";
import ShippingAddressForm from "./shipping-address-form";

export const metadata: Metadata = { title: "Shopping Address" };

const ShippingAddressPage = async () => {
  const cart = await getMyCart();
  const session = await auth();
  const userId = session?.user?.id;

  if (!cart || cart.items.length === 0) redirect("/cart");

  if (!userId) throw new Error("No user ID");

  const user = await getUserById(userId);

  return (
    <>
      <ShippingAddressForm address={user.address as ShippingAddress} />
    </>
  );
};

export default ShippingAddressPage;
