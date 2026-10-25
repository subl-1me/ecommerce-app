import { Order } from './order';

export interface Sale {
  _id: string;
  order: Order;
  amount: number;
  status: string;
  stripePaymentIntentId: string | null;
  paypalPaymentIntentId: string | null;
  paidAt: Date;
  createAt: Date;
  updateAt: Date;
}

export interface SaleInput {
  customer: string;
}
