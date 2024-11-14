import Joi from "joi";
import { OrderItem, OrderStatus, PaymentStatus } from "../../types";
import { BaseCreateDto } from "../dto";

export interface CreateOrderDto extends BaseCreateDto {
    orderItems?: OrderItem[];
}

export function validateCreateOrder(order: CreateOrderDto)
  {
    const JoiSchema = Joi.object({
      
        orderItems: Joi.array().items({
            productId: Joi.number().required(),
            quantity: Joi.number().required(),
            price: Joi.number().required()
          }).min(1),               
        
    }).options({ abortEarly: false });
  
    return JoiSchema.validate(order)
}