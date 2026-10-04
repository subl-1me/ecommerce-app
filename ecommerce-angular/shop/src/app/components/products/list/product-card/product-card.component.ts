import { Component, IterableDiffers, OnInit } from '@angular/core';
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
import { Auth } from 'src/app/models/auth';
import { ItemCartService } from 'src/app/services/item-cart.service';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css'],
})
export class ProductCardComponent implements OnInit {
  @Input() product: Product;
  public faCartShopping = faCartShopping;
  public wishlistAux: string[];
  public cartAux: Cart;
  public auth: Auth;

  constructor(
    private _customerService: CustomerService,
    private _authService: AuthService,
    private _socketService: SocketService,
    private _cartService: CartService,
    private _itemCartService: ItemCartService,
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
    this.cartAux = {
      items: [],
    };
    this.auth = {
      user: null,
      jwt: '',
    };
    this.wishlistAux = [];
  }

  ngOnInit(): void {
    this.getWishList();
    this.getAuth();
    this._socketService.on('updated-wishlist').subscribe((response: any) => {
      this.wishlistAux = response.wishlist;
      this._authService.updateWishlist(response.wishlist);
    });

    this._socketService.on('updated-cart').subscribe((response: any) => {
      console.log('Recieved from product-card', response);
      // this._authService.updateWishlist(response.wishlist);
      this.cartAux = response.cart;
    });
  }

  public getAuth(): void {
    this.auth = this._authService.getUser();
    this.cartAux = this.auth.user.cart;
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

    // set cart to user
    await lastValueFrom(this._customerService.editProfile(user._id, user));

    const addItemResponse = await lastValueFrom(
      this._cartService.addItem(user.cart._id || '', productId),
    );
    user.cart = addItemResponse.result;
    this._socketService.emit('cart-changes', { cart: user.cart });
    this.cartAux = user.cart;
    this._authService.update(user);
  }

  public async addToWishlist(productId: string): Promise<void> {
    let user = <Customer>this._authService.getUser().user;
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
