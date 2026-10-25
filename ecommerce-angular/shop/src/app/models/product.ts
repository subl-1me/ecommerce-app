import ProductVariant from './productVariant';
import { Sale } from './sale';
import Stock from './stock';

export interface Product {
  _id: string;
  slug: string;
  shortDesc: string;
  fullDesc: string;
  price: number;
  sales: Sale[];
  stock: Stock[];
  variants: ProductVariant[];
  rating: string;
  gallery: Gallery[];
  category: string;
}

interface Gallery {
  _id?: string;
  path?: string;
}
