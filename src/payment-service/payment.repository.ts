import prisma from "../util/lib/client.ts";
import { PaymentDto } from "./payment.dto";

export class PaymentRepository {

    async findAll(): Promise<PaymentDto[]> {
        const payments = await prisma.payment.findMany();

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