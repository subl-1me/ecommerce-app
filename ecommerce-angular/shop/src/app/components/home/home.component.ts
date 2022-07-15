import { Component, OnInit } from '@angular/core';

import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [ ProductsService ]
})
export class HomeComponent implements OnInit {

  public latestProducts: any;
  public topSellers: any;

  constructor(
    private _productService: ProductsService,
  ) { }

  ngOnInit(): void {
    this.getNewProducts();
    this.getTopSellers();
  }

  getNewProducts():void{
    this._productService.getLatestProducts().subscribe((response) => {
      if(!response.products) return;

      this.latestProducts = response.products;
      console.log(this.latestProducts);
    })
  }

  getTopSellers():void{
    this._productService.getTopSellers().subscribe((response) => {
      if(!response.products) return;

      this.topSellers = response.products;
      console.log(this.topSellers);
    })
  }

}
