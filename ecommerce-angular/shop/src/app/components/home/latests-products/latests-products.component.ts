import { Component, OnInit } from '@angular/core';
import { Input } from '@angular/core';
import { lastValueFrom } from 'rxjs';

import { ProductsService } from 'src/app/services/products.service';
import { Product } from 'src/app/models/product';

@Component({
  selector: 'app-latests-products',
  templateUrl: './latests-products.component.html',
  styleUrls: ['./latests-products.component.css'],
})
export class LatestsProductsComponent implements OnInit {
  @Input() latestProducts: Product[];
  constructor(private _productService: ProductsService) {
    this.latestProducts = [];
  }

  ngOnInit(): void {
    this.getNewProducts();
  }

  async getNewProducts(): Promise<void> {
    const response = await lastValueFrom(
      this._productService.getLatestProducts(),
    );
    if (!response.success) {
      alert(response.message);
      return;
    }

    this.latestProducts = response.products;
  }
}
