import { CreateOrderDto } from "../dto/orders/create-order.dto";
import { Order } from "../types";
import prisma from "../util/db";

export default class OrderRepository {
    async create(data: CreateOrderDto) {
        const order = await prisma.order.create({
            data
          });

        return order
    }

    async findAll(): Promise<Order[]> {
        const orders = await prisma.order.findMany();

        return orders;
    }
}