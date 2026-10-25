import { Customer } from './customer';

export interface Address {
  _id?: string;
  customer?: Customer;
  addressee: string;
  dni: string;
  zip: string;
  address: string;
  district: string;
  country: string;
  region: string;
  province: string;
  phone: string;
  principal: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AddressInput {
  customer: string;
  addressee: string;
  dni: string;
  zip: string;
  address: string;
  district: string;
  country: string;
  region: string;
  province: string;
  phone: string;
  principal: boolean;
}
