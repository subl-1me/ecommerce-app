import { Component, OnInit } from '@angular/core';
import { Input } from '@angular/core';
import { Product } from 'src/app/models/product';

@Component({
  selector: 'app-trending-products',
  templateUrl: './trending-products.component.html',
  styleUrls: ['./trending-products.component.css'],
})
export class TrendingProductsComponent implements OnInit {
  @Input() trendingProducts: Product[];
  constructor() {
    this.trendingProducts = [];
  }

  ngOnInit(): void {}
}
