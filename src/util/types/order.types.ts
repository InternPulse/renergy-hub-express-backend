import { User } from './user.types';
import { Payment, ShippingOptions } from './payment.types';
import { Product } from './product.types';
import { Cart, OrderStatus, PaymentStatus } from '.';
import { Decimal } from '@prisma/client/runtime/library';

export interface Order {
  id: number;
  userId: number;
  orderDate: Date;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  totalAmount: number;
  user: User;
  orderItems?: OrderItem[];
  payments?: Payment[];
  shippingOptions?: ShippingOptions[];
  orderReturns?: OrderReturn[];
}

export interface OrderItem {
  id?: number;
  orderId?: number;
  productId: number;
  quantity: number;
  price: Decimal;
  cartId: number;
  order?: Order;
  product?: Product;
  cart?: Cart;
}

export interface OrderReturn {
  id: number;
  productId: number;
  userId: number;
  orderId: number;
  user: User;
  product: Product;
  order: Order;
}
