import { PaymentMethod, PaymentStatus } from './enums';
import { Order } from './order.types';
import { User } from './user.types';

export interface Payment {
  id: number;
  userId: number;
  orderId: number;
  status: PaymentStatus;
  amount: number;
  paymentDate: Date;
  method: PaymentMethod;
  user: User;
  order: Order;
}

export interface ShippingOptions {
  id: number;
  amount: number;
  orderId: number;
  order: Order;
}
