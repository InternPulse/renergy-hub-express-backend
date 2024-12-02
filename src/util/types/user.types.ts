import { Cart } from "./cart.types";
import { Role } from "./enums";
import { Order, OrderReturn } from "./order.types";
import { Payment } from "./payment.types";
import { Product, WishList } from "./product.types";

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  userType: Role | null | undefined;
  registerType: string;
  registrationDate: Date;
  phoneNumber: string;
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
  order: Order[];

}

export interface Review {
  
}
