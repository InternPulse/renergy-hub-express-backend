import prisma from "../util/lib/client";
import { Cart } from "../util/types";

export default class CartRepository {
    
    async findByUserId(userId: number): Promise<Cart[]> {
        const cart = prisma.order.findMany({
            where: { userId }
          });
        return cart;
    }
}