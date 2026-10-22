import { Component, OnInit } from '@angular/core';
import { Input } from '@angular/core';

import { Order } from 'src/app/models/order';
import { OrderService } from 'src/app/services/order.service';

// Icons
import { faClock, faJarWheat } from '@fortawesome/free-solid-svg-icons';
import { faHashtag } from '@fortawesome/free-solid-svg-icons';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';
import { faCoins } from '@fortawesome/free-solid-svg-icons';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { lastValueFrom } from 'rxjs';
import { Auth } from 'src/app/models/auth';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.css'],
  providers: [OrderService],
})
export class MyOrdersComponent implements OnInit {
  // icons
  faClock = faClock;
  faCalendar = faCalendar;
  faHashtag = faHashtag;
  faCoins = faCoins;
  faCheck = faCheck;

  public orders: Order[] = [];
  public auth: Auth = {
    jwt: '',
    user: null,
  };
  public customerID = localStorage.getItem('_id');

  constructor(
    private _orderService: OrderService,
    private _authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.loadAuth();
    this.getOrders();
  }

  private loadAuth(): void {
    this.auth = this._authService.getUser();
  }

  async getOrders(): Promise<void> {
    const response = await lastValueFrom(
      this._orderService.getCustomerOrders(this.auth.user._id),
    );

    if (!response.success) {
      alert(response.message);
      return;
    }

    this.orders = response.orders;
  }
}
