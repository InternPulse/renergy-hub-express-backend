import Joi from "joi";
import { PaymentMethod } from "../util/types/enums";

export interface CreatePaymentDto {
    paymentId?: string;
    userId: number;
    orderId?: number;
    amount?: number;
    method?: PaymentMethod;
    paymentDate?: Date;
    callbackUrl: string;
}

export interface PaymentDto {
    paymentUrl?: string;
}
export interface WebhookData {
    event: string
    data: Data
  }
  
  export interface Data {
    id: number
    domain: string
    status: string
    reference: string
    amount: number
    message: any
    gateway_response: string
    paid_at: string
    created_at: string
    channel: string
    currency: string
    ip_address: string
    metadata: number
    log: Log
    fees: any
    customer: Customer
    authorization: Authorization
    plan: Plan
  }
  
  export interface Log {
    time_spent: number
    attempts: number
    authentication: string
    errors: number
    success: boolean
    mobile: boolean
    input: any[]
    channel: any
    history: History[]
  }
  
  export interface History {
    type: string
    message: string
    time: number
  }
  
  export interface Customer {
    id: number
    first_name: string
    last_name: string
    email: string
    customer_code: string
    phone: any
    metadata: any
    risk_action: string
  }
  
  export interface Authorization {
    authorization_code: string
    bin: string
    last4: string
    exp_month: string
    exp_year: string
    card_type: string
    bank: string
    country_code: string
    brand: string
    account_name: string
  }
  
  export interface Plan {}



export function validatePaymentDto(order: CreatePaymentDto)
  {
    const JoiSchema = Joi.object({
      
        paymentId: Joi.string().allow('').optional(),  
        userId:  Joi.string().allow('').optional(),   
        orderId: Joi.number().required(), 
        callbackUrl:  Joi.string().allow('').optional(),   
        method: Joi.string().valid(... Object.values(PaymentMethod)).required()           
        
    }).options({ abortEarly: false });
  
    return JoiSchema.validate(order)
}