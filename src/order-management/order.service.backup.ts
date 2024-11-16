import { CreateOrderDto, validateCreateOrder } from "./order.dto";
import OrderRepository from "./order.repository";

export default class OrderManagementService {

    private readonly orderRepository: OrderRepository = new OrderRepository();

    async createOrder(data: CreateOrderDto) {

        const { error } = validateCreateOrder(data);
        
        if (error) {
            throw new Error(`Invalid requests. ${error.message}`);
        }

        return await this.orderRepository.create(data);
    }


    async listOrders() {
        return await this.orderRepository.findAll();
    }
}