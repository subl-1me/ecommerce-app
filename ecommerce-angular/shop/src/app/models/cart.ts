import { Product } from './product';

export interface Cart {
  _id?: string;
  items: Product[];
  createdAt?: string;
  updatedAt?: string;
}
