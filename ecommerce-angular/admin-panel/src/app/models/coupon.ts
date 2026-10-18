import Admin from './admin';

export interface CouponInput {
  addedBy: string;
  code: string;
  type: string;
  value: number;
  limit: number;
}

export interface Coupon {
  _id: string;
  addedBy: Admin;
  code: string;
  type: string;
  value: number;
  limit: number;
  createdAt: Date;
  updatedAt: Date;
}
