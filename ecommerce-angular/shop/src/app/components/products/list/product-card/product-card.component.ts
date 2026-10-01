import { Component, OnInit } from '@angular/core';
import { Input } from '@angular/core';
import { Product } from 'src/app/models/product';

import { faCartShopping } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css'],
})
export class ProductCardComponent implements OnInit {
  public faCartShopping = faCartShopping;
  @Input() product: Product;

  constructor() {
    this.product = {
      _id: '',
      title: '',
      description: '',
      content: '',
      stock: '',
      price: 0,
      sales: '',
      rating: '',
      gallery: [],
      coverImage: '',
      category: '',
    };
  }

  ngOnInit(): void {}

  public addToCart(productId: string): void {}
}
