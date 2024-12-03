import { generatePaymentUrl } from "../util/payment.gateway";
import { OrderStatus, Payment, PaymentStatus, User } from "../util/types";
import { CreatePaymentDto, PaymentDto, validatePaymentDto, WebhookData } from "./payment.dto";
import { PaymentRepository } from "./payment.repository";
import { v4 as uuidv4, v6 as uuidv6 } from 'uuid';
import * as orderService from './../order-management/order.service'
import { OrderOperationEnum } from "../util/types/enums";
import UserRepository from "../order-management/user.repository";
import { Decimal } from "@prisma/client/runtime/library";
import { Prisma } from "@prisma/client";
import OrderRepository from "../order-management/order.repository";
import CustomHttpError from "../util/error.handler";

const paymentRepository = new PaymentRepository();
const userRepository = new UserRepository();
const orderRepository = new OrderRepository();

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
        throw new CustomHttpError (400, `Invalid Request: ${error}`)

    const order = await orderService.getOrderById(<number>data.orderId);

    if(!order)
        throw new CustomHttpError (400, `Invalid Order`)

    if(order.paymentStatus == PaymentStatus.COMPLETED)
        throw new CustomHttpError (400, `Order has been paid`)

    data.amount = order.totalAmount.toNumber();

    data.amount = data.amount + order.shippingOption.amount.toNumber();

    const paymentId = uuidv4();
    const payment = await paymentRepository.create({ paymentId, ...data, userId: parseInt(user?.userID), paymentDate: new Date() });

    const userObj = await userRepository.findByUserId(parseInt(user?.userID));

    const paymentUrl = await generatePaymentUrl(<string>userObj?.email, paymentId, order.totalAmount.toNumber());
  
    return { paymentUrl };
};


export const findAll = async (paymentStatus: PaymentStatus): Promise<Payment[]> => {
    
    
    const payments = await paymentRepository.findAll(paymentStatus);
  
    return payments;
};


export const findAllByuser = async (userId: number, paymentStatus: PaymentStatus): Promise<Payment[]> => {
    
    
    const payments = await paymentRepository.findAllByUser(userId);
  
    return payments;
};


export const processWebhook = async (webhookData: WebhookData): Promise<Payment> => {
    
    
    const payment = await getPaymentById(webhookData.data.reference);

    if(!payment)
        throw new Error (`Invalid Payment`)

    payment.status = PaymentStatus.COMPLETED;

    const orderId = payment.orderId;

    const orderOperationEnum = OrderOperationEnum.IN_QUEUE;

    await paymentRepository.update(payment);

    const order = await orderRepository.findByOrderId(orderId);

    order.paymentStatus = PaymentStatus.COMPLETED;

    await orderRepository.update(order);

    await orderService.performOrderOperation( { orderId, orderOperationEnum });
  
    return payment;
};