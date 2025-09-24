"use client";

import { Button } from "@/components/ui/button";
import { addItemToCart, removeItemFromCart } from "@/lib/actions/cart.action";
import { Cart, CartItem } from "@/types";
import { Minus, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface Props {
  item: CartItem;
  cart?: Cart;
}

const AddToCart = ({ item, cart }: Props) => {
  const router = useRouter();

  const handleAddToCart = async () => {
    const resp = await addItemToCart(item);

    if (!resp.success) {
      // TODO: change style error toast bg
      toast.error(resp.message);
      return;
    }

    toast(resp.message, {
      action: <Button onClick={() => router.push("/cart")}>Go To Cart</Button>,
    });
  };

  const handleRemoveFromCart = async () => {
    const resp = await removeItemFromCart(item.productId);

    resp.success ? toast.success(resp.message) : toast.error(resp.message);
  };

  const existItem =
    cart && cart.items.find((itm) => itm.productId === item.productId);

  return existItem ? (
    <div>
      <Button type="button" variant="outline" onClick={handleRemoveFromCart}>
        <Minus className="h-4 w-4" />
      </Button>
      <span className="px-2"> {existItem.qty}</span>
      <Button type="button" variant="outline" onClick={handleAddToCart}>
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  ) : (
    <Button className="w-full" type="button" onClick={handleAddToCart}>
      <Plus /> Add to cart
    </Button>
  );
};

export default AddToCart;
