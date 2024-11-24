import { CreateOrderDto, CreateOrderItemDto } from "./order.dto";
import { Order } from "../util/types";
import prisma from "../util/db";

export default class OrderRepository {
    async create(data: CreateOrderDto) {
        const order = await prisma.order.create({
            data: {
                orderDate:  new Date(),
                totalAmount: 1000
            }
          });

        return order
    }

    async findAll(): Promise<Order[]> {
        const orders = await prisma.order.findMany();

        return orders;
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

    
}
