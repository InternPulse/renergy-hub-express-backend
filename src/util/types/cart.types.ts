import { Decimal } from "@prisma/client/runtime/library";

export interface Cart {
    id: number;
    productId: number;
    userId: number;
    price: Decimal;
    quantity: number;
}