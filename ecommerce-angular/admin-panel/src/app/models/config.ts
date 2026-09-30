export interface Config {
  _id?: any;
  categories: Array<Category>;
  shopName?: string;
  serie?: string;
  correlation?: string;
  logo: Image;
}

interface Image {
  public_id: string;
  path: string;
}

interface Category {
  name: string;
}
