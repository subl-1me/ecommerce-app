export default interface ProductInventory {
  product: string;
  qty: number;
  provider: string;
  addedBy: string;
  createdAt?: Date;
  updatedAt?: Date;
}
