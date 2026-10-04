import { Cart } from './cart';

export interface Customer {
  _id: string;
  names?: string;
  surnames?: string;
  email?: string;
  dni?: number;
  phone?: string;
  gender?: string;
  notes?: string[];
  wishlist: string[];
  cart: Cart;
  password?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
