import { Component, OnInit } from '@angular/core';
import { Input } from '@angular/core';
import { Product } from 'src/app/models/product';
import { Customer } from 'src/app/models/customer';

import { CustomerService } from 'src/app/services/customer.service';
import { AuthService } from 'src/app/services/auth.service';
import { CartService } from 'src/app/services/cart.service';
import { SocketService } from 'src/app/services/socket/socket.service';

import { faCartShopping } from '@fortawesome/free-solid-svg-icons';
import { lastValueFrom } from 'rxjs';
import { Cart } from 'src/app/models/cart';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css'],
})
export class ProductCardComponent implements OnInit {
  @Input() product: Product;
  public faCartShopping = faCartShopping;
  public wishlistAux: string[];

  constructor(
    private _customerService: CustomerService,
    private _authService: AuthService,
    private _socketService: SocketService,
    private _cartService: CartService,
  ) {
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
    this.wishlistAux = [];
  }

  ngOnInit(): void {
    this.getWishList();
    this._socketService.on('updated-wishlist').subscribe((response: any) => {
      console.log('Recieved from product-card', response);
      this.wishlistAux = response.wishlist;
      this._authService.updateWishlist(response.wishlist);
    });
  }

  public async addToCart(productId: string): Promise<void> {
    const user = this._authService.getUser().user;
    if (!user.cart) {
      // create new cart
      const createResponse = await lastValueFrom(
        this._cartService.createCart(),
      );
      if (!createResponse.success) {
        alert(createResponse.message);
        return;
      }
      user.cart = createResponse.cart;
    }

    const addItemResponse = await lastValueFrom(
      this._cartService.addItem(user.cart._id || '', productId),
    );
    user.cart = addItemResponse.result;
    this._authService.update(user);
  }

  public async addToWishlist(productId: string): Promise<void> {
    let user = <Customer>this._authService.getUser().user;
    console.log(user);
    user.wishlist = [...user.wishlist, productId];
    const response = await lastValueFrom(
      this._customerService.editProfile(user._id || '', user),
    );

    if (!response.success) {
      alert('Error saving wishlist.');
    }
    this._socketService.emit('wishlist-changes', {
      wishlist: user.wishlist,
    });
    this.wishlistAux = [...user.wishlist];
  }

  private getWishList(): void {
    this.wishlistAux = this._authService.getUser().user.wishlist;
  }

  public isOnWishlist(productId: string): boolean {
    return this.wishlistAux.includes(productId);
  }

  public async removeFromWishlist(productId: string): Promise<void> {
    let user = this._authService.getUser().user;
    const filtered = user.wishlist.filter(
      (itemId: string) => itemId !== productId,
    );
    user.wishlist = [...filtered];
    const response = await lastValueFrom(
      this._customerService.editProfile(user._id || '', user),
    );

    if (!response.success) {
      alert('Error saving wishlist.');
    }
    this._socketService.emit('wishlist-changes', {
      wishlist: user.wishlist,
    });
    this.wishlistAux = [...user.wishlist];
  }
}
