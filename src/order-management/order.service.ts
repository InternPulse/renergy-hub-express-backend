import prisma from "../util/lib/client.ts";
import { Cart } from "../util/types/cart.types.ts";
import { PaymentStatus } from "../util/types/enums.ts";
import { OrderItem } from "../util/types/order.types.ts";
import CartRepository from "./cart.repository.ts";
import { CreateNewOrderDto, CreateOrderDto } from "./order.dto.ts";
import OrderRepository from "./order.repository.ts";

const cartRepository = new CartRepository();
const orderRepository = new OrderRepository();

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

export const createOrderV2 = async (data: CreateNewOrderDto) => {

  const cart = await cartRepository.findByUserId(data.userId);

  if(!cart)
    throw new Error("No item in User Cart")

  const order = orderRepository.create(orderBuilder(data.userId, cart) )

  return order;
};

export const createOrder = async (data: CreateOrderDto) => {



  const order = orderRepository.create(data )

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


const orderBuilder = (userId: number, carts: Cart[]): CreateOrderDto => {
  
  let orderItems:OrderItem[] = [];

  let totalAmount = 0;



  carts.forEach((cart: Cart) => {
    totalAmount += (cart.price * cart.quantity);

    orderItems.push({
      productId: cart.productId,
      quantity: cart.quantity,
      price: cart.price,
      cartId: cart.id
    })
  }) 
  const orderDto: CreateOrderDto = {
    orderDate: new Date(),
    userId,
    totalAmount,
    paymentStatus: PaymentStatus.PENDING,
    orderItems
  };

  return orderDto;

}
