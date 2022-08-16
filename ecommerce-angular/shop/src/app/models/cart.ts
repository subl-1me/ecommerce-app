import { Product } from "./product"
import { Customer } from "./customer"

export interface Cart{
    _id: string,
    customer?: Customer,
    product?: Product,
    size?: string,
    amount?: number
    createdAt?: string,
}