export interface Product {
  _id?: string;
  title: string;
  description: string;
  content: string;
  gallery: Image[];
  price: number;
  stock: number;
  category: string;
  status?: string;
  sales?: string;
  rating?: string;
  updatedAt?: string;
}

interface Image {
  tempId: string;
  public_id: string | null;
  path: string;
}
