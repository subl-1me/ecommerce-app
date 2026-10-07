import ProductImage from './productImage';
import ProductInventory from './productInventory';
import ProductVariant from './productVariant';
import Sale from './sale';

export interface Product {
  _id?: string;
  slug: string;
  shortDesc: string;
  fullDesc: string;
  gallery: ProductImage[];
  variants: ProductVariant[];
  stock: ProductInventory[];
  price: number;
  category: string;
  sales: Sale[];
  status?: string;
  reviews?: any;
  rating?: string;
  updatedAt?: string;
}
