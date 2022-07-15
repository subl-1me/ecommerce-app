import { Component, OnInit } from '@angular/core';

import { Product } from 'src/app/models/product';
import  { ProductsService } from 'src/app/services/products.service';

import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { faPlus } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css'],
  providers: [ ProductsService ]
})
export class WishlistComponent implements OnInit {

  // Icons
  faTrash = faTrash;
  faPlus = faPlus;

  public loadedProducts: Array<Product>;
  public productsIds: any;

  constructor(
    private _productService: ProductsService
  ) {
    this.loadedProducts = [];
    this.productsIds = JSON.parse(localStorage.getItem('productsFav') || '[]');
   }

  ngOnInit(): void {
    this.getMyProducts();
  }

  getMyProducts():void{
    for(let i = 0; i < this.productsIds.length; i++){
      this._productService.getProductById(this.productsIds[i]).subscribe((response) => {
        this.loadedProducts.push(response.product);
        console.log(response);
      })
    }
  }

}
