import { Customer } from './customer';
import { Direction } from './direction';
import { SaleDetails } from './saleDetail';

export interface Sale{
    customer?: Customer,
    nSale?: String,
    subtotal?: Number,
    details?: Array<SaleDetails>,
    shippingType?: String,
    shippingPrice?: Number,
    shippingAddress?: Direction,
    shippingNote?: String,
    transaction?: String,
    coupon?: String,
    status?: String,
    createdAt?: String
}