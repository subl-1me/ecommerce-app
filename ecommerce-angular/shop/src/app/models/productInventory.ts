export default interface ProductInventory {
  product: string;
  stock: number;
  provider: string;
  addedBy: string;
  createdAt?: Date;
  updatedAt?: Date;
}
