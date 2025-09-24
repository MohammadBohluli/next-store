"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { addItemToCart, removeItemFromCart } from "@/lib/actions/cart.action";
import { type Cart } from "@/types";
import { Loader, Minus, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

interface Props {
  cart?: Cart;
}

const CartTable = ({ cart }: Props) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  return (
    <>
      <h1 className="py-4 h2-bold">Shopping Cart</h1>
      {!cart || cart.items.length === 0 ? (
        <div>
          Cart is Empty. <Link href="/">Go Shopping</Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-4 md:gap-5">
          <div className="overflow-x-auto md:col-span-3">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead className="text-center">Quantity</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cart.items.map((itm) => (
                  <TableRow key={itm.slug}>
                    <TableCell>
                      <Link
                        href={`/products/${itm.slug}`}
                        className="flex items-center"
                      >
                        <Image
                          src={itm.image}
                          alt={itm.name}
                          width={50}
                          height={50}
                        />
                        <span className="px-2">{itm.name}</span>
                      </Link>
                    </TableCell>
                    <TableCell className="flex-center gap-2">
                      <Button
                        disabled={isPending}
                        variant={"outline"}
                        type="button"
                        onClick={() =>
                          startTransition(async () => {
                            const resp = await removeItemFromCart(
                              itm.productId
                            );
                            if (!resp.success) {
                              toast.error(resp.message);
                            }
                          })
                        }
                      >
                        {isPending ? (
                          <Loader className="w-4 h-4 animate-spin" />
                        ) : (
                          <Minus className="h-4 w-4" />
                        )}
                      </Button>
                      <span>{itm.qty}</span>
                      <Button
                        disabled={isPending}
                        variant={"outline"}
                        type="button"
                        onClick={() =>
                          startTransition(async () => {
                            const resp = await addItemToCart(itm);
                            if (!resp.success) {
                              toast.error(resp.message);
                            }
                          })
                        }
                      >
                        {isPending ? (
                          <Loader className="w-4 h-4 animate-spin" />
                        ) : (
                          <Plus className="h-4 w-4" />
                        )}
                      </Button>
                    </TableCell>
                    <TableCell className="text-right">${itm.price}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </>
  );
};

export default CartTable;
