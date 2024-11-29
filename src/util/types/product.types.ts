import { User } from './user.types';
import { OrderReturn, OrderItem } from './order.types';
import { Cart } from './cart.types';

export interface Product {
  id: number;
  categoryId: number;
  userId: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  image: string;
  createdAt: Date;
  updatedAt: Date;
  category: Category;
  user: User;
  cart?: Cart[];
  wishlist?: WishList[];
  reviews?: Review[];
  orderItems?: OrderItem[];
  orderReturns?: OrderReturn[];
  productInfo?: ProductInformation[];
}

export interface Category {
  id: number;
  categoryName: string;
  description: string;
  products?: Product[];
}

export interface ProductInformation {
  id: number;
  name: string;
  value: string;
  productId: number;
  product: Product;
}


export interface WishList {

}

export interface Review {

}