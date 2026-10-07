export default interface ProductInventory {
  productId: string;
  stock: number;
  provider: string;
  addedBy: string;
  createdAt?: Date;
  updatedAt?: Date;
}
