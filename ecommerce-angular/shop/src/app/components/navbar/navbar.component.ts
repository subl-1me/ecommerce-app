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

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  providers: [CustomerService, ConfigsService, ProductsService, AuthService],
})
export class NavbarComponent implements OnInit {
  @Output() openCartModal = new EventEmitter<boolean>();
  public config: Config;
  public auth: Auth;
  public _idStorage: any;
  public categories: any;

  public showFavsMenu: boolean;

  public productsFav: any;
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
    private _productsService: ProductsService,
    private _authService: AuthService,
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
    this.auth = {
      user: null,
      jwt: '',
    };
    this.productsFav = JSON.parse(localStorage.getItem('productsFav') || '[]');
    this.loadedProducts = [];
    this.showFavsMenu = false;
  }

  ngOnInit(): void {
    this.getAuth();
    this.getProductsFav();
    this._configsService.getShopConfigs().subscribe((res) => {
      if (res.success) {
        this.config = res.config;
      }
    });
  }

  getAuth(): void {
    this.auth = this._authService.getUser();
  }

  logOut(): void {
    if (!this._authService.isAuthenticated()) {
      return;
    }

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

  getProductsFav(): void {
    for (let i = 0; i < this.productsFav.length; i++) {
      this._productsService
        .getProductById(this.productsFav[i])
        .subscribe((response) => {
          if (response.product) {
            this.loadedProducts.push(response.product);
          }
        });
    }
  }

  updatedBreadcrumb(): void {}

  openCart(): void {
    this.openCartModal.emit(true);
  }
}
