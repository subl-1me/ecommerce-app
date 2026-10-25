import { Product } from './product';

export default interface CartItem {
  _id?: string;
  product: Product;
  qty: number;
  size: string;
  color: string;
  createdAt?: Date;
  updatedAt?: Date;
}
