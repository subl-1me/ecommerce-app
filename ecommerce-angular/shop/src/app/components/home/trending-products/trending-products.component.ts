import { Component, OnInit } from '@angular/core';
import { Input } from '@angular/core';

import { ProductsService } from 'src/app/services/products.service';
import { Product } from 'src/app/models/product';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-trending-products',
  templateUrl: './trending-products.component.html',
  styleUrls: ['./trending-products.component.css'],
})
export class TrendingProductsComponent implements OnInit {
  @Input() trendingProducts: Product[];
  constructor(private _productService: ProductsService) {
    this.trendingProducts = [];
  }

  ngOnInit(): void {
    this.getTopSellers();
  }

  async getTopSellers(): Promise<void> {
    const response = await lastValueFrom(this._productService.getTopSellers());
    if (!response.success) {
      alert(response.message);
      return;
    }

    this.trendingProducts = response.products;
  }
}
