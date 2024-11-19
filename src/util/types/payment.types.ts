import { Order } from './order.types';
import { User } from './user.types';
export interface Payment {
  id: number;
  userId: number;
  orderId: number;
  status: string;
  amount: number;
  createdAt: Date;
  method: string;
  user: User;
  order: Order;
}

export interface ShippingOptions {
  id: number;
  amount: number;
  orderId: number;
  order: Order;
}
