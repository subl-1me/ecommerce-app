import CartItem from './cartItem';

export interface Cart {
  _id?: string;
  items: CartItem[];
  createdAt?: string;
  updatedAt?: string;
}
