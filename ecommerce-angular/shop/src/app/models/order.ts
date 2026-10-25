import { Direction } from 'readline';
import CartItem from './cartItem';
import { Coupon } from './coupon';
import { Customer } from './customer';
import { ShippingMethod } from './shippingMethod';
import { ShippingInformation } from './ShippingInformation';

export interface OrderInput {
  customer: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  total: number;
  shippingMethod: string;
  shippingInformation: string;
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
  shippingMethod: ShippingMethod;
  shippingInformation: ShippingInformation;
  coupon: Coupon | null;
  paymentProviderName: string;
  paymentStatus: string;
  expectedArrival?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
