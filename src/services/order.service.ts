import { CreateOrderDto } from "../dto/orders/create-order.dto";
import OrderRepository from "../repository/order.repository";

export default class OrderManagementService {

    private readonly orderRepository: OrderRepository = new OrderRepository();

    async createOrder( data: CreateOrderDto) {

    }


    async listOrders() {
        return await this.orderRepository.findAll();
    }
}