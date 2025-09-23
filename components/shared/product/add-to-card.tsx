"use client";

import { Button } from "@/components/ui/button";
import { addItemToCart } from "@/lib/actions/cart.action";
import { CartItem } from "@/types";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface Props {
  item: CartItem;
}

const AddToCart = ({ item }: Props) => {
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

  return (
    <Button className="w-full" type="button" onClick={handleAddToCart}>
      <Plus /> Add to cart
    </Button>
  );
};

export default AddToCart;
