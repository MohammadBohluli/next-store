import { auth } from "@/auth";
import { getMyCart } from "@/lib/actions/cart.action";
import { getUserById } from "@/lib/actions/user.action";
import { redirect } from "next/navigation";
import { Metadata } from "next/types";

export const metadata: Metadata = { title: "Shopping Address" };

const ShippingAddressPage = async () => {
  const cart = await getMyCart();
  const session = await auth();
  const userId = session?.user?.id;

  if (!cart || cart.items.length === 0) redirect("/cart");

  if (!userId) throw new Error("No user ID");

  const user = await getUserById(userId);

  return <div>ship</div>;
};

export default ShippingAddressPage;
