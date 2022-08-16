import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Product } from 'src/app/models/product';
import  { ProductsService } from 'src/app/services/products.service';

import { WishlistService } from 'src/app/services/wishlist.service';

import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { faPlus } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css'],
  providers: [ ProductsService, WishlistService ]
})

export class WishlistComponent implements OnInit {

  // Icons
  faTrash = faTrash;
  faPlus = faPlus;

  public products: Array<Product>
  public customerId = localStorage.getItem('_id');

  constructor(
    private _productService: ProductsService,
    private _wishlistService: WishlistService,
    private _router: Router
  ) {
    this.products = [];
  }


  ngOnInit(): void {
    this.getMyProducts();
  }

  getMyProducts():void{
    this._wishlistService.items(this.customerId).subscribe((response) =>{
      this.products = response.items;
      console.log(this.products);
    })
  }

  public goToProductPage(productId:any):void{
    this._router.navigate(['products/detail/'+productId])
  }

  public removeFromWishlist(productId:any):void{
    this._wishlistService.remove(this.customerId, productId).subscribe((response) => {
      if(response.status !== 200) return;

      this.getMyProducts();
    })
  }

}
