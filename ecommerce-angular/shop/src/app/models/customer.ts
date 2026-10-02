export interface Customer {
  _id?: string;
  username: string;
  names: string;
  surnames: string;
  email: string;
  password: string;
  gender?: string;
  phone?: string;
  birthday?: string;
  dni?: string;
  country?: string;
  wishlist: string[];
  city?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
