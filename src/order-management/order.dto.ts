import Joi from "joi";
import { OrderItem, OrderStatus, PaymentStatus } from "../util/types";

export interface CreateOrderDto {
    userId?: number;
    orderDate?: Date;
    paymentStatus?: PaymentStatus;
    totalAmount?: number;
    orderItems?: OrderItem[];
}

export interface CreateOrderItemDto {
    orderId: number;
    productId: number;
    quantity: number;
    price: number;
    cartId: number;
}

export interface CreateNewOrderDto {
    userId: number;
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