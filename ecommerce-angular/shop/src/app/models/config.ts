export interface Config {
  _id: any;
  categories: Array<String>;
  shippingMethods: ShippingMethods[];
  shopName: string;
  serie?: string;
  correlation?: string;
  logo: Image;
}

interface Image {
  public_id: string;
  path: string;
}

interface ShippingMethods {
  _id: string;
  price: number;
  title: string;
  time: string;
  createdAt: Date;
  updatedAt: Date;
}
