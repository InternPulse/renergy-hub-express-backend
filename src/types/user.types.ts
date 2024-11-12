import { Order, OrderReturn } from './order.types';
import { Payment } from './payment.types';
import { Product } from './product.types';

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  userType: string;
  registerType: string;
  registrationDate: Date;
  phoneNumber: number;
  cart?: Cart[];
  notifications?: Notification[];
  wishlist?: WishList[];
  reviews?: Review[];
  orders?: Order[];
  payments?: Payment[];
  addresses?: ShippingAddress[];
  products?: Product[];
  orderReturns?: OrderReturn[];
}

export interface Notification {
  id: number;
  message: string;
  userId: number;
  user: User;
}

export interface ShippingAddress {
  id: number;
  userId: number;
  state: string;
  addressLine: string;
  zipCode: string;
  city: string;
  country: string;
  isDefault: boolean;
  user: User;
}
