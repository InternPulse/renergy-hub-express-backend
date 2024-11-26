import prisma from "../util/db.ts";
import { Payment, PaymentStatus } from "../util/types/index.ts";
import { CreatePaymentDto } from "./payment.dto.ts";

export class PaymentRepository {

    async create(data: CreatePaymentDto): Promise<Payment> {
        const payment = await prisma.payment.create({
          data: { ...data },
        });

        return payment;
    }

    async update(payment: Payment): Promise<Payment> {
      return prisma.payment.update({
        where: { id: payment.id },
        data: payment,
      });
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

    async findByPaymentId(paymentId: string) {
      const payment = prisma.payment.findFirst({
          where: { paymentId }
        });
      return payment;
  }
}