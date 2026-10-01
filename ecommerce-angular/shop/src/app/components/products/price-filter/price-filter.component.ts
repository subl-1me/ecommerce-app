import { Component, EventEmitter, OnInit } from '@angular/core';
import { Product } from 'src/app/models/product';
import { Input, Output } from '@angular/core';

@Component({
  selector: 'app-price-filter',
  templateUrl: './price-filter.component.html',
  styleUrls: ['./price-filter.component.css'],
})
export class PriceFilterComponent implements OnInit {
  public min: number;
  public max: number;

  @Input() products: Product[];
  @Output() filteredProducts = new EventEmitter<Product[]>();

  constructor() {
    this.min = 0;
    this.max = 0;
    this.products = [];
  }

  ngOnInit(): void {}

  public onSubmit() {
    if (this.min == 0 && this.max == 0) {
      this.filteredProducts.emit(this.products);
      return;
    }

    const filtered = this.products.filter((item) => {
      return +item.price >= this.min && +item.price <= this.max;
    });

    this.filteredProducts.emit(filtered);
  }

  public reset(): void {
    this.max = 0;
    this.min = 0;
  }
}
