import { PaymentMethod } from "../types/enums";

export interface CreatePaymentDto {
    paymentId: string;
    userId: number;
    orderId?: number;
    amount?: number;
    method?: PaymentMethod;
}

export interface PaymentDto {
    paymentUrl: string;
}