import { Cart } from './cart';

export interface CustomerInput {
  username: string;
  names: string;
  surnames: string;
  email: string;
  password: string;
  language: string;
  country: string;
  wishlist: string[];
  cart?: Cart;
}

export interface Customer {
  _id?: string;
  username: string;
  names: string;
  surnames: string;
  email: string;
  password: string;
  language: string;
  country?: string;
  wishlist: string[];
  cart?: Cart;
  createdAt?: Date;
  updatedAt?: Date;
}
