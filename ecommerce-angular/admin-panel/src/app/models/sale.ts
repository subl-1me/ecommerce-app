export default interface Sale {
  _id?: string;
  customerId: string;
  shippingAddress?: string;
  shippingPrice?: number;
  shippingType?: string;
  status?: string;
  subtotal?: number;
  transaction?: string;
}
