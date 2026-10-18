export interface Coupon {
  _id?: string;
  type: string;
  code: string;
  value: number;
  limit: number;
  createdAt?: Date;
  updatedAt?: Date;
}
