import { Customer } from './customer';

export interface Direction{
    _id?: string,
    customer?: Customer,
    addressee?: string,
    dni?: string,
    zip?: string,
    direction?: string,
    city?: string,
    district?: string,
    country?: string,
    region?: string,
    province?: string,
    phone?: string,
    principal?: boolean,
    createdAt?: string
}