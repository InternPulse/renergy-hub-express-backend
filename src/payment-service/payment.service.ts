import { generatePaymentUrl } from "../util/payment.gateway";
import { Payment, PaymentStatus, User } from "../util/types";
import { CreatePaymentDto, PaymentDto, validatePaymentDto, WebhookData } from "./payment.dto";
import { PaymentRepository } from "./payment.repository";
import { v4 as uuidv4, v6 as uuidv6 } from 'uuid';
import * as orderService from './../order-management/order.service'

const paymentRepository = new PaymentRepository();

export const getAllPayments = async (paymentStatus: PaymentStatus) => {
    return paymentRepository.findAll(paymentStatus)
};

export const getAllPaymentsByUser = async (userId: number) => {
    return paymentRepository.findAllByUser(userId)
};


export const getPaymentById = async (paymentId: string): Promise<Payment> => {
    return paymentRepository.findByPaymentId(paymentId)
};
  
export const initializePayment = async (user: User, data: CreatePaymentDto): Promise<PaymentDto> => {
    
    const { error } = validatePaymentDto(data);

    if(error)
        throw new Error (`Invalid Request: ${error}`)

    const order = await orderService.getOrderById(<number>data.orderId);

    if(!order)
        throw new Error (`Invalid Order`)

    const paymentId = uuidv4();
    const payment = await paymentRepository.create({ paymentId, ...data, userId: user.id });

    const paymentUrl = await generatePaymentUrl(user.email, paymentId, <number>data.amount);
  
    return { paymentUrl };
};


export const processWebhook = async (webhookData: WebhookData): Promise<Payment> => {
    
    
    const payment = await getPaymentById(webhookData.data.reference);

    if(!payment)
        throw new Error (`Invalid Payment`)

    payment.status = PaymentStatus.COMPLETED;

    await paymentRepository.update(payment);
  
    return payment;
};