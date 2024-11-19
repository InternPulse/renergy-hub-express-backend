import { PaymentStatus } from "../types/enums.ts";
import { Payment } from "../types/payment.types.ts";
import prisma from "../util/db.ts";
import { CreatePaymentDto } from "./payment.dto.ts";

export class PaymentRepository {

    async create(paymentDto: CreatePaymentDto): Promise<Payment> {
        const payment = await prisma.payment.create({
          userId: paymentDto.userId,
          orderId: paymentDto.orderId,
          amount: paymentDto.amount,
          method: paymentDto.method,
          paymentDate: new Date()
        });

        return payment;
    }

    async findAllByUser(userId: number): Promise<Payment[]> {
      const payments = await prisma.payment.findMany({
        where: {
          userId
        },
      });

      return payments;
  }

    async findAll(paymentStatus: PaymentStatus): Promise<Payment[]> {
      
      const payments = await prisma.payment.findMany({
        where: {
          paymentStatus
        },
      });

      return payments;
  }

    async findByOrderId(orderId: number) {
        const order = prisma.payment.findFirst({
            where: { orderId },
            include: {
              order: true,
              user: true
            },
          });
        
    }
}