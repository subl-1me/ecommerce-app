import { Product } from './product';

interface CartItem {
  _id?: string;
  size: string;
  product: Product;
  amount: Number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Cart {
  _id?: string;
  items: CartItem[];
  createdAt?: string;
  updatedAt?: string;
}
