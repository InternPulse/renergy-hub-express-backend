import { CreateOrderItemDto } from "./order.dto";
import { OrderitemRepository } from "./order.repository";




export class OrderItemService{
    private orderItemRepository: OrderitemRepository;

    constructor(){
        this.orderItemRepository = new OrderitemRepository()
    }

    async createOrderItem(createOrderItemDto:CreateOrderItemDto){
        const newOrderItem= await this.orderItemRepository.create(createOrderItemDto)
        return newOrderItem
    }

    async getOrderItembyId(id:number){
        const getallid = await this.orderItemRepository.findUnique(id)
        return getallid
    }

    async updateorderitems(id:number , data:CreateOrderItemDto){
        const updateorderitem = await this.orderItemRepository.update(id,data)
        return updateorderitem

    }
}