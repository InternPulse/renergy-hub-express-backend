import { CreateOrderDto, CreateOrderItemDto } from "./order.dto";
import { Order } from "../util/types";
import prisma from "../util/db";
import { GenerateOrderNumber } from "../util/payment.gateway";

export default class OrderRepository {
    async create(createOrder: CreateOrderDto) {
        const order = prisma.order.create({
            data: {
              userId: createOrder.userId,
              orderNumber: GenerateOrderNumber(),
              orderDate: createOrder.orderDate,
              paymentStatus: createOrder.paymentStatus,
              totalAmount: createOrder.totalAmount,
              orderItems: { create: createOrder.orderItems },
            },
          });

        return order
    }

    async update(order: Order): Promise<Order> {
        return prisma.order.update({
          where: { id: order.id },
          data: order,
        });
      }

    async findAll(): Promise<Order[]> {
        const orders = await prisma.order.findMany();

        return orders;
    }

    async findByOrderId(id: number): Promise<Order> {
        const order = await prisma.order.findUnique({
            where: { id }
          });
        return order;
    }
}

export  class OrderitemRepository{
    async create ( data: CreateOrderItemDto){
        const orderitems = await prisma.orderItem.create({
            data:{
                ...data
            }
        })
        return orderitems
    }

    async findUnique(orderitemid : number ){
        const getallbyid = await prisma.orderItem.findUnique({
            where:{
                id: orderitemid
            }
        
        })
        return getallbyid
    }
    async update(id:number,data:CreateOrderItemDto){
        const updatebyid = await prisma.orderItem.update({
            where:{
                id:id
            },

            data: {
                orderId: data.orderId,    // Set new values from the provided data
                productId: data.productId,
                quantity: data.quantity,
                price: data.price,
                cartId: data.cartId,
            },
            
        })

        return updatebyid
    }

    async delete(id:number){
        const deletebyid = await prisma.orderItem.delete({
            where:{
                id:id
            }
        })
        return deletebyid
    }

    
}
