import Joi from "joi";
import { OrderItem, OrderStatus, PaymentStatus } from "../util/types";
import { OrderOperationEnum } from "../util/types/enums";
import { Decimal } from "@prisma/client/runtime/library";

export interface CreateOrderDto {
    userId?: number;
    shippingAddressId?: number;
    orderDate?: Date;
    orderNumber?: string;
    paymentStatus?: PaymentStatus;
    totalAmount?: number;
    orderItems?: CreateOrderItemDto[];
}

export interface CreateOrderItemDto {
    productId: number;
    quantity: number;
    price: number;
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
        shippingAddressId: Joi.number().required(),     
        orderDate: Joi.date().allow(null).optional(),
        orderNumber: Joi.string().allow('').optional(), 
        totalAmount: Joi.number().allow('',null).optional(),   
        orderItems: Joi.array().items({
            productId: Joi.number().required(),
            quantity: Joi.number().required(),
            price: Joi.number().allow(null,'').optional()
          }).min(1),               
        
    }).options({ abortEarly: false });
  
    return JoiSchema.validate(order)
}