import { Component, OnInit, Output, EventEmitter } from '@angular/core';

// Icons
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import { Product } from 'src/app/models/product';

import { CustomerService } from 'src/app/services/customer.service';
import { ConfigsService } from 'src/app/services/configs.service';
import { AuthService } from 'src/app/services/auth.service';
import { ProductsService } from 'src/app/services/products.service';
import { Config } from 'src/app/models/config';
import { Auth } from 'src/app/models/auth';
import { SocketService } from 'src/app/services/socket/socket.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  providers: [
    CustomerService,
    ConfigsService,
    ProductsService,
    AuthService,
    SocketService,
  ],
})
export class NavbarComponent implements OnInit {
  @Output() openCartModal = new EventEmitter<boolean>();
  public config: Config;
  public auth: Auth;
  public _idStorage: any;
  public categories: any;

  public showFavsMenu: boolean;
  public wishlist: string[];
  public cartItemsCount: Number;

  public loadedProducts: Array<Product>;

  // icons
  faHeart = faHeart;
  faCartShopping = faCartShopping;
  faUser = faUser;
  faMagnifyingGlass = faMagnifyingGlass;
  faArrowRightFromBracket = faArrowRightFromBracket;
  faPlus = faPlus;

  constructor(
    private _configsService: ConfigsService,
    private _authService: AuthService,
    private _socketService: SocketService,
  ) {
    this.config = {
      _id: '',
      categories: [],
      shopName: '',
      logo: {
        public_id: '',
        path: '',
      },
    };
    this.wishlist = [];
    this.auth = {
      user: null,
      jwt: '',
    };
    this.loadedProducts = [];
    this.showFavsMenu = false;
    this.cartItemsCount = 0;
    this._socketService.on('updated-wishlist').subscribe((response: any) => {
      this.wishlist = response.wishlist;
    });

    this._socketService.on('updated-cart').subscribe((response: any) => {
      this.cartItemsCount = response.cart.items.length;
    });
  }

  ngOnInit(): void {
    console.log(this._authService.isAuthenticated());
    if (this._authService.isAuthenticated()) {
      this.getAuth();
      this.getCartCount();
      this.getWishListCount();
    }
    this._configsService.getShopConfigs().subscribe((res) => {
      if (res.success) {
        this.config = res.config;
      }
    });
  }

  getAuth(): void {
    this.auth = this._authService.getUser();
  }

  getWishListCount(): void {
    const wishlist = this.auth.user.wishlist;
    if (!wishlist) return;
    this.wishlist = [...wishlist];
  }

  getCartCount(): void {
    const cart = this._authService.getUser().user.cart;
    if (!cart) return;
    this.cartItemsCount = cart.items.length;
  }

  logOut(): void {
    localStorage.removeItem('auth');
    location.reload();
  }

  enableFavsMenu(): void {
    if (this.showFavsMenu) {
      this.showFavsMenu = false;
      return;
    }
    this.showFavsMenu = true;
  }

  disableFavsMenu(): void {
    this.showFavsMenu = false;
  }

  isOnMenu(event: any): void {
    if (
      event.target.className !== 'card-body' ||
      event.target.className !== 'text-muted'
    ) {
      this.showFavsMenu = false;
      return;
    }
  }

  updatedBreadcrumb(): void {}

  openCart(): void {
    this.openCartModal.emit(true);
  }
}
