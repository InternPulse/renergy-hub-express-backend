import { generatePaymentUrl } from "../util/payment.gateway";
import { PaymentStatus } from "../util/types";
import { CreatePaymentDto, PaymentDto } from "./payment.dto";
import { PaymentRepository } from "./payment.repository";
import { v4 as uuidv4, v6 as uuidv6 } from 'uuid';

const paymentRepository = new PaymentRepository();

export const getAllPayments = async (paymentStatus: PaymentStatus) => {
    return paymentRepository.findAll(paymentStatus)
};

export const getAllPaymentsByUser = async (userId: number) => {
    return paymentRepository.findAllByUser(userId)
};
  
export const initializePayment = async (data: CreatePaymentDto): Promise<PaymentDto> => {
    
    data.paymentId = uuidv4();
    const payment = await paymentRepository.create(data);

    const paymentUrl = generatePaymentUrl(data.paymentId, <number>data.amount);
  
    return { paymentUrl };
  };