import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ConfigsService } from '../../../services/configs.service';
import { ProductsService } from 'src/app/services/products.service';

import { Product } from 'src/app/models/product';

import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';
import { Config } from 'src/app/models/config';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
  providers: [ConfigsService, ProductsService],
})
export class ListComponent implements OnInit {
  public filterCategory: any = [];
  public config: Config;

  public sortByOption: any;
  public productsAmount: number;
  public totalProductsMessage: string;
  public noItemsFoundMessage: string;

  public addToCartMesssage: string;
  public productsCount: any;
  public expandProductCard: boolean;

  public products: Product[];
  public productsAux: Product[];

  public faHeart = faHeart;
  public faStar = faStar;
  public faCartShopping = faCartShopping;

  constructor(
    private _ConfigsService: ConfigsService,
    private _productsService: ProductsService,
    private _router: ActivatedRoute,
    private _routerr: Router,
  ) {
    this.config = {
      _id: '',
      logo: {
        path: '',
        public_id: '',
      },
      shopName: '',
      categories: [],
    };

    this.expandProductCard = false;
    this.sortByOption = 'default';
    this.productsAmount = 1;
    this.totalProductsMessage = '';
    this.noItemsFoundMessage = '';
    this.addToCartMesssage = '';

    this.products = [];
    this.productsAux = [];
  }

  ngOnInit(): void {
    this.products = [];
    this.getEcomInfo();
    this.getProducts();
    // this.getCategoryRoute();
  }

  getCategoryRoute(): void {
    let categoryRoute = this._router.snapshot.paramMap
      .get('category')
      ?.toLowerCase();
    if (!categoryRoute) return;

    // this.getProductsByCategory(categoryRoute);
  }

  private async getEcomInfo(): Promise<void> {
    const response = await lastValueFrom(this._ConfigsService.getShopConfigs());
    if (!response.success) {
      return;
    }

    this.config = response.config;
  }

  public onFilterByCategory(products: Product[]): void {
    this.products = products;
  }

  public onFilterByPrice(products: Product[]): void {
    this.products = products;
  }

  async getProducts(): Promise<void> {
    //TODO: Add pop outs
    const response = await lastValueFrom(this._productsService.getProducts());
    if (!response.success) {
      return;
    }
    this.products = response.products;
    this.productsAux = response.products;
    this.productsAmount = this.products.length;
  }

  public sortBy(): void {
    switch (this.sortByOption) {
      case 'popularity':
        this.productsAux.sort(function (a, b) {
          if (a.sales < b.sales) return 1;
          if (a.sales > b.sales) return -1;

          return 0;
        });
        break;
      case 'lowestPrice':
        this.productsAux.sort(function (a, b) {
          if (a.price > b.price) return 1;
          if (a.price < b.price) return -1;

          return 0;
        });
        break;
      case 'highestPrice':
        this.productsAux.sort(function (a, b) {
          if (a.price < b.price) return 1;
          if (a.price > b.price) return -1;

          return 0;
        });
        break;
      case 'default':
        this.productsAux = [...this.products];
        break;
    }
  }

  public filterByAmount() {
    this.sortByOption = 'default';
    const productsTemp = [...this.products];
    this.productsAux = productsTemp.splice(0, this.productsAmount);
  }

  addToCart(productID: any): void {
    this._routerr.navigate([`products/detail/${productID}`]);
  }
}
