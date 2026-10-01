import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/models/product';
import { Input } from '@angular/core';

@Component({
  selector: 'app-latests-products',
  templateUrl: './latests-products.component.html',
  styleUrls: ['./latests-products.component.css'],
})
export class LatestsProductsComponent implements OnInit {
  @Input() latestProducts: Product[];
  constructor() {
    this.latestProducts = [];
  }

  ngOnInit(): void {}
}
