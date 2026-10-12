export default interface ProductInventory {
  _id?: string;
  product: string;
  qty: number;
  provider: string;
  addedBy: string;
  createdAt?: Date;
  updatedAt?: Date;
}
