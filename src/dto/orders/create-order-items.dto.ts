import { Decimal } from "@prisma/client/runtime/library";


class CreateOrderItemDto {
    orderId: number;
    productId: number;
    quantity: number;
    price: Decimal;
    cartId: number;

    constructor(orderId: number, productId: number, quantity: number, price: Decimal, cartId: number) {
        this.orderId = orderId;
        this.productId = productId;
        this.quantity = quantity;
        this.price = price;
        this.cartId = cartId;
    }
}

export default CreateOrderItemDto;