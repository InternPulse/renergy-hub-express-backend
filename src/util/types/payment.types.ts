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

export interface ShippingOption {
  id: number;
  amount: number;
  name: string;
  orders: Order[];
}
