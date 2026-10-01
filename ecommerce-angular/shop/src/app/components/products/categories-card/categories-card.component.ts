import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ProductsService } from 'src/app/services/products.service';
import { ConfigsService } from 'src/app/services/configs.service';

import { Product } from 'src/app/models/product';
import { Config } from 'src/app/models/config';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-categories-card',
  templateUrl: './categories-card.component.html',
  styleUrls: ['./categories-card.component.css'],
})
export class CategoriesCardComponent implements OnInit {
  @Output() filteredProducts = new EventEmitter<Product[]>();
  public config: Config;
  public categoriesAux: string[];
  public searchParam: string;

  constructor(
    private _productService: ProductsService,
    private _configService: ConfigsService,
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
    this.searchParam = '';
    this.categoriesAux = [];
  }

  ngOnInit(): void {
    this.getConfig();
  }

  public async getProductsByCategory(category: string): Promise<void> {
    const response = await lastValueFrom(
      this._productService.getProductsByCategory(category),
    );

    if (!response.success) {
      //TODO: pop out
      alert('Error fetching products');
      return;
    }

    this.filteredProducts.emit(response.products);
  }

  private getConfig(): void {
    this._configService.getShopConfigs().subscribe((response) => {
      this.config = response.config;
      this.categoriesAux = this.config.categories as string[];
    });
  }

  public async reloadList(): Promise<void> {
    const response = await lastValueFrom(this._productService.getProducts());
    if (!response.success) {
      return;
    }

    this.filteredProducts.emit(response.products);
  }

  public searchCategory(_typedString: Event): void {
    this.categoriesAux = this.config.categories.filter((category) =>
      category
        .toLocaleLowerCase()
        .includes(this.searchParam.toLocaleLowerCase()),
    ) as string[];
  }
}
