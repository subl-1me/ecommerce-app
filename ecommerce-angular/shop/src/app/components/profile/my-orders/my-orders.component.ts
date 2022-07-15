import { Component, OnInit } from '@angular/core';

import { SaleService } from 'src/app/services/sale.service';

import { Sale } from 'src/app/models/sale';

// Icons
import { faClock } from '@fortawesome/free-solid-svg-icons';
import { faHashtag } from '@fortawesome/free-solid-svg-icons';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';
import { faCoins } from '@fortawesome/free-solid-svg-icons';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.css'],
  providers: [ SaleService ]
})
export class MyOrdersComponent implements OnInit {

  // icons
  faClock = faClock;
  faCalendar = faCalendar;
  faHashtag = faHashtag;
  faCoins = faCoins;
  faCheck = faCheck;

  public sales: Array<Sale>;
  public customerID = localStorage.getItem('_id');

  constructor(
    private _saleService: SaleService
  ) { 
    this.sales = [];
  }

  ngOnInit(): void {
    this.getOrders();
  }

  getOrders():void{
    this._saleService.getSales(this.customerID).subscribe((response) => {
      if(!response.status) return;

      this.sales = response.sales;
      console.log(this.sales);
    })
  }

}
