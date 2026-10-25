export interface ShippinInformationInput {
  customer: string;
  email: string;
  address: string;
  addressee: string;
  country: string;
  state: string;
  city: string;
  zip: string;
  phone: string;
  default: boolean;
}

export interface ShippingInformation {
  _id?: string;
  customer: string | null;
  email: string;
  address: string;
  state: string;
  addressee: string;
  country: string;
  city: string;
  zip: string;
  phone: string;
  default: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
