import { Component, OnInit } from '@angular/core';

import { ProductsService } from 'src/app/services/products.service';
import { ConfigsService } from 'src/app/services/configs.service';
import { Config } from 'src/app/models/config';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [ProductsService],
})
export class HomeComponent implements OnInit {
  public latestProducts: any;
  public topSellers: any;

  public config: Config;

  constructor(
    private _productService: ProductsService,
    private _configService: ConfigsService,
  ) {
    this.config = {
      _id: '',
      shopName: '',
      categories: [],
      logo: { path: '', public_id: '' },
    };
  }

  ngOnInit(): void {
    this.getNewProducts();
    this.getTopSellers();
    this.getConfig();
  }

  getConfig(): void {
    this._configService.getShopConfigs().subscribe((response) => {
      console.log(response);
      this.config = response.actualConfig[0];
    });
  }

  getNewProducts(): void {
    this._productService.getLatestProducts().subscribe((response) => {
      if (!response.products) return;

      this.latestProducts = response.products;
    });
  }

  getTopSellers(): void {
    this._productService.getTopSellers().subscribe((response) => {
      if (!response.products) return;

      this.topSellers = response.products;
    });
  }
}
