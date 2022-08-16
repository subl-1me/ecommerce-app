import { Customer } from './customer';

export interface Review{
    customer?: Customer,
    product?: string,
    content?: string,
    rating?: string,
    createdAt?: string
}