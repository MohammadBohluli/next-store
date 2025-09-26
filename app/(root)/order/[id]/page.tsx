import { getOrderById } from "@/lib/actions/order.action";
import { ShippingAddress } from "@/types";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import OrderDetailsTable from "./order-details-table";

export const metadata: Metadata = { title: "Order Details" };

interface Props {
  params: Promise<{
    id: string;
  }>;
}
const OrderDetails = async ({ params }: Props) => {
  const { id } = await params;

  const order = await getOrderById(id);
  if (!order) notFound();

  return (
    <OrderDetailsTable
      order={{
        ...order,
        orderItems: order.OrderItem,
        shippingAddress: order.shippingAddress as ShippingAddress,
      }}
    />
  );
};

export default OrderDetails;
