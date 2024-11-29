import prisma from "../util/lib/client.ts";
import { GenerateOrderNumber } from "../util/payment.gateway.ts";
import { Cart } from "../util/types/cart.types.ts";
import { OrderOperationEnum, OrderStatus, PaymentStatus } from "../util/types/enums.ts";
import { OrderItem } from "../util/types/order.types.ts";
import CartRepository from "./cart.repository.ts";
import { CreateNewOrderDto, CreateOrderDto, OrderOperationDto, validateCreateOrder } from "./order.dto.ts";
import OrderRepository from "./order.repository.ts";
import UserRepository from "./user.repository.ts";

const cartRepository = new CartRepository();
const orderRepository = new OrderRepository();
const userRepository = new UserRepository();

export const getAllOrders = async () => {
  return prisma.order.findMany({
    include: {
      orderItems: true,
      payments: true,
      shippingOptions: true,
      orderReturns: true,
    },
  });
};

export const getAllOrdersByUser = async (userId: number) => {
  return prisma.order.findMany({
    where: { userId },
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

  if (!order)
    throw new Error("Order Not found")

  return order;
};

export const createOrderV2 = async (data: CreateNewOrderDto) => {

  const cart = await cartRepository.findByUserId(data.userId);

  if(!cart)
    throw new Error("No item in User Cart")

  const order = orderRepository.create(orderBuilder(data.userId, cart) )

  return order;
};

export const createOrder = async (data: CreateOrderDto) => {


  const { error } = validateCreateOrder(data);

  if(error)
    throw new Error(`Invalid Request: ${error}`);

  // create a variable for the sum and initialize it
  let sum = 0;

  // calculate sum using forEach() method
  data.orderItems?.forEach( item => {
    sum += (item.price * item.quantity);
  })

  data.totalAmount = sum;
  //const user = await userRepository.findByUserId(data)

  const order = orderRepository.create(data)

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

export const performOrderOperation = async (orderOperation: OrderOperationDto) => {
  
  let orderStatus = OrderStatus.PENDING;
  const order = await orderRepository.findByOrderId(orderOperation.orderId);

  if(!order)
    throw new Error("order does not exist");

  switch(orderOperation.orderOperationEnum)
  {
      case OrderOperationEnum.IN_QUEUE:
        orderStatus = OrderStatus.PROCESSING;
      break;
  }

  order.orderStatus = orderStatus;

  return await orderRepository.update(order);
};


const orderBuilder = (userId: number, carts: Cart[]): CreateOrderDto => {
  
  let orderItems:OrderItem[] = [];

  let totalAmount = 0;



  carts.forEach((cart: Cart) => {
    totalAmount += (cart.price.toNumber() * cart.quantity);

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
    orderItems,
    orderNumber: GenerateOrderNumber()
  };

  return orderDto;

}
