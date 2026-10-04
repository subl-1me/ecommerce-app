import { Component, OnInit } from '@angular/core';

import { Product } from 'src/app/models/product';
import { ProductsService } from 'src/app/services/products.service';

import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { Auth } from 'src/app/models/auth';
import { AuthService } from 'src/app/services/auth.service';
import { lastValueFrom } from 'rxjs';
import { SocketService } from 'src/app/services/socket/socket.service';
import { CustomerService } from 'src/app/services/customer.service';
import { Customer } from 'src/app/models/customer';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css'],
  providers: [ProductsService, AuthService, SocketService, CustomerService],
})
export class WishlistComponent implements OnInit {
  // Icons
  faTrash = faTrash;
  faPlus = faPlus;

  public products: Product[];
  public productsIds: any;

  public wishlistAux: string[];
  public auth: Auth;

  constructor(
    private _productService: ProductsService,
    private _authService: AuthService,
    private _socketService: SocketService,
    private _CustomerService: CustomerService,
  ) {
    this.products = [];
    this.auth = {
      user: null,
      jwt: '',
    };
    this.wishlistAux = [];
  }

  ngOnInit(): void {
    if (this._authService.isAuthenticated()) {
      this.auth.user = this._authService.getUser().user;
      this.auth.jwt = this._authService.getUser().jwt;
      this.wishlistAux = this.auth.user.wishlist;
      this.getMyProducts(this.auth.user.wishlist);
    }

    this._socketService
      .on('updated-wishlist')
      .subscribe(async (response: any) => {
        this.wishlistAux = response.wishlist;
        await this.getMyProducts(response.wishlist);
        this._authService.updateWishlist(response.wishlist);
      });
  }

  public async removeFromWishlist(productId: string): Promise<void> {
    const filtered = this.wishlistAux.filter(
      (itemId: string) => itemId !== productId,
    );
    let user = <Customer>this._authService.getUser().user;
    user.wishlist = [...filtered];
    const response = await lastValueFrom(
      this._CustomerService.editProfile(user._id || '', user),
    );

    if (!response.success) {
      alert('error updating wishlist');
      return;
    }

    // send socket
    this._socketService.emit('wishlist-changes', { wishlist: user.wishlist });
    this._authService.updateWishlist(filtered);
    //update on local storage
    await this.getMyProducts(filtered);
    this.wishlistAux = [...filtered];
  }

  public async getMyProducts(wishlist: string[]): Promise<void> {
    const observables = wishlist.map((itemId: string) =>
      lastValueFrom(this._productService.getProductById(itemId)),
    );

    const responses = await Promise.all(observables);
    const success = responses.filter((response) => response.success);
    this.products = success.map((res) => res.product);
  }
}
