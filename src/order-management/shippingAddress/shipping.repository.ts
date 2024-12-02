import prisma from "../../util/db";
import { ShippingAddress } from "../../util/types";
import { CreateShippingAddressDto } from "./shipping.address.dto";

export default class ShippingRepository {
    async create(data: CreateShippingAddressDto) {
        const shippingAddress = prisma.shippingAddress.create({
            data
          });

        return shippingAddress
    }

    async update(shippingAddress: ShippingAddress): Promise<ShippingAddress> {
        return prisma.shippingAddress.update({
          where: { id: shippingAddress.id },
          data: shippingAddress,
        });
      }

    async findAll(): Promise<ShippingAddress[]> {
        const shippingAddress = await prisma.shippingAddress.findMany();

        return shippingAddress;
    }

    async findByUserId(userId: number): Promise<ShippingAddress[]> {
        const shippingAddress = await prisma.shippingAddress.findMany({
            where: { userId }
          });
        return shippingAddress;
    }
}
