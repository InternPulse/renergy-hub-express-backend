import prisma from "../util/lib/client.ts";

export const getAllOrders = async (query: any) => {
  return prisma.order.findMany({
    include: {
      orderItems: true,
      payments: true,
      shippingOptions: true,
      orderReturns: true,
    },
  });
};

export const getOrderById = async (orderId: number) => {
  const order = prisma.order.findUnique({
    where: { id: orderId },
    include: {
      orderItems: true,
      payments: true,
      shippingOptions: true,
      orderReturns: true,
    },
  });

  if(!order)
    throw new Error("Order Not found")
};

export const createOrder = async (data: any) => {
  const { userId, orderDate, paymentStatus, totalAmount, orderItems } = data;
  const order = prisma.order.create({
    data: {
      userId,
      orderDate,
      paymentStatus,
      totalAmount,
      orderItems: { create: orderItems },
    },
  });

  return order;
};

export const updateOrder = async (orderId: number, data: any) => {
  return prisma.order.update({
    where: { id: orderId },
    data,
  });
};

export const deleteOrder = async (orderId: number) => {
  return prisma.order.delete({
    where: { id: orderId },
  });
};