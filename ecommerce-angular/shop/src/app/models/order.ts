import { Direction } from 'readline';
import CartItem from './cartItem';
import { Coupon } from './coupon';
import { Customer } from './customer';
import { ShippingMethod } from './shippingMethod';

export interface OrderInput {
  customer: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  address: Direction | null;
  total: number;
  shippingMethod: ShippingMethod;
  shippingCost: Number;
  coupon: Coupon | null;
  paymentProviderName: string;
  paymentStatus: string;
}

export interface Order {
  _id?: string;
  customer: Customer;
  items: CartItem[];
  subtotal: number;
  total: number;
  shippingCost: Number;
  coupon: Coupon | null;
  paymentProviderName: string;
  paymentStatus: string;
  createdAt?: Date;
  updatedAt?: Date;
}
