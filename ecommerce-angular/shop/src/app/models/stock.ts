export default interface Stock {
  _id?: string;
  productId: string;
  qty: number;
  provider: string;
  addedBy: string;
  createdAt?: Date;
  updatedAt?: Date;
}
