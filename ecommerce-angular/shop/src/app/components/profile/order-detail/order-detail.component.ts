import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { SaleService } from 'src/app/services/sale.service';
import { Sale } from 'src/app/models/sale';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent implements OnInit {

  // Icons

  public order: any;
  public transaction: any;
  public payment_method: string;

  public total: number;
  public shippingMethod: string;
  public createdAt: string;
  public status: string;

  constructor(
    private _saleService: SaleService,
    private _router: ActivatedRoute
  ) {
    this.order = [];
    this.transaction = this._router.snapshot.paramMap.get('transaction');

    this.shippingMethod = '';
    this.createdAt = '';
    this.status = '';
    this.total = 0;
    this.payment_method = '';
   }

  ngOnInit(): void {
    this.getOrderDetail();
  }

  getOrderDetail():void{
    this._saleService.getSaleDetail(this.transaction).subscribe((response) => {
      if(!response.saleDetail) return;

      this.order = response.saleDetail;

      this.order.forEach((element:any) => {
        this.total += element.subtotal;
      });

      this.shippingMethod = this.order[0].sale.shippingType;
      this.createdAt = this.order[0].sale.createdAt;
      this.status = this.order[0].sale.status;
      this.payment_method = this.order[0].sale.payment_method;
      

      console.log(this.order);
    })
  }

}
