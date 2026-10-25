import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Order } from 'src/app/models/order';
import { lastValueFrom } from 'rxjs';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css'],
})
export class OrderDetailComponent implements OnInit {
  // Icons

  public order: Order = {
    _id: '',
    customer: {
      username: '',
      email: '',
      wishlist: [],
      names: '',
      surnames: '',
      password: '',
    },
    items: [],
    total: 0,
    subtotal: 0,
    shippingInformation: {
      customer: null,
      email: '',
      address: '',
      addressee: '',
      phone: '',
      country: '',
      city: '',
      state: '',
      zip: '',
      default: false,
    },
    shippingMethod: {
      price: 0,
      time: '',
      title: '',
    },
    paymentProviderName: '',
    paymentStatus: 'pending',
    coupon: null,
  };
  public orderId: string = '';
  public payment_method: string;

  public total: number;
  public shippingMethod: string;
  public createdAt: string;
  public status: string;

  constructor(
    private _orderService: OrderService,
    private _router: ActivatedRoute,
  ) {
    this.orderId = this._router.snapshot.paramMap.get('orderId') || '';

    this.shippingMethod = '';
    this.createdAt = '';
    this.status = '';
    this.total = 0;
    this.payment_method = '';
  }

  ngOnInit(): void {
    this.getOrder();
  }

  public async getOrder(): Promise<void> {
    const response = await lastValueFrom(
      this._orderService.getOrderById(this.orderId),
    );
    if (!response.success) {
      alert(response.message);
      return;
    }

    this.order = response.order;
  }
}
