//import prisma from '../../prisma/';
import prisma from "../lib/client.ts";

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
  return prisma.order.findUnique({
    where: { id: orderId },
    include: {
      orderItems: true,
      payments: true,
      shippingOptions: true,
      orderReturns: true,
    },
  });
};

export const createOrder = async (data: any) => {
  const { userId, orderDate, paymentStatus, totalAmount, orderItems } = data;
  return prisma.order.create({
    data: {
      userId,
      orderDate,
      paymentStatus,
      totalAmount,
      orderItems: { create: orderItems },
    },
  });
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
