export interface Product {
  _id: string;
  title: string;
  description: string;
  content: string;
  stock: string;
  price: number;
  sales: string;
  rating: string;
  gallery: Gallery[];
  colors?: string[];
  coverImage: string;
  category: string;
}

interface Gallery {
  _id?: string;
  path?: string;
}
