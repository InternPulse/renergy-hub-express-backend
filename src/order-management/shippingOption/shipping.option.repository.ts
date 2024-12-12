import prisma from "../../util/db";
import { ShippingOption } from "../../util/types/payment.types";
import { CreateShippingOptionDto } from "./shipping.option.dto";

export default class ShippingOptionRepository {
    async create(data: CreateShippingOptionDto) {
        const shippingOption = prisma.shippingOption.create({
            data
          });

        return shippingOption
    }

    async update(shippingOption: ShippingOption): Promise<ShippingOption> {
        return prisma.shippingOption.update({
          where: { id: shippingOption.id },
          data: shippingOption,
        });
      }

    async findAll(): Promise<ShippingOption[]> {
        const shippingOption = await prisma.shippingOption.findMany();

        return shippingOption;
    }

    async findByUserId(userId: number): Promise<ShippingOption[]> {
        const shippingOption = await prisma.shippingOption.findMany({
            where: { userId }
          });
        return shippingOption;
    }
}
