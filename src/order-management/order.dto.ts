import Joi from "joi";
import { OrderItem, OrderStatus, PaymentStatus } from "../util/types";
import { OrderOperationEnum } from "../util/types/enums";

export interface CreateOrderDto {
    userId?: number;
    orderDate?: Date;
    orderNumber?: string;
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

export interface OrderOperationDto {
    orderId: number;
    orderOperationEnum: OrderOperationEnum;
}

export function validateCreateOrder(order: CreateOrderDto)
  {
    const JoiSchema = Joi.object({
      
        userId: Joi.number().required(),     
        orderDate: Joi.date().allow(null).optional(),
        orderNumber: Joi.string().allow('').optional(), 
        totalAmount: Joi.number().required(),   
        orderItems: Joi.array().items({
            productId: Joi.number().required(),
            quantity: Joi.number().required(),
            price: Joi.number().required()
          }).min(1),               
        
    }).options({ abortEarly: false });
  
    return JoiSchema.validate(order)
}