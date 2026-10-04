import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Product } from 'src/app/models/product';
import { Review } from 'src/app/models/review';
import { Cart } from 'src/app/models/cart';
import { Auth } from 'src/app/models/auth';

import { ProductsService } from 'src/app/services/products.service';
import { ReviewService } from 'src/app/services/review.service';
import { CartService } from 'src/app/services/cart.service';

// Icons
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { faCopy } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from 'src/app/services/auth.service';
import { SocketService } from 'src/app/services/socket/socket.service';
import { lastValueFrom } from 'rxjs';
import { CustomerService } from 'src/app/services/customer.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css'],
  providers: [
    ProductsService,
    ReviewService,
    CartService,
    AuthService,
    SocketService,
  ],
})
export class DetailComponent implements OnInit {
  public product: Product;
  public productID: any;

  public auth: Auth;
  public cart: Cart;

  public isLoading: boolean;

  public review: Review;
  public reviews: Array<Review>;
  public showReviewForm: boolean;

  public selectedAmount: number;
  public selectedSize: string;
  public addToCartMessage: string;
  public invalidAmountMessage: string;

  public showGeneral: boolean;
  public showDetails: boolean;
  public showReviews: boolean;
  public customersReview: any;

  public productsFav: any;
  public isAdded: boolean;
  public isURLCoppied: boolean;

  // icons
  faHeart = faHeart;
  faCartShopping = faCartShopping;
  faStar = faStar;
  faCheck = faCheck;
  faPlus = faPlus;
  faCopy = faCopy;

  constructor(
    private _productsService: ProductsService,
    private _authService: AuthService,
    private _socketService: SocketService,
    private _reviewService: ReviewService,
    private _customerService: CustomerService,
    private _cartService: CartService,
    private _router: ActivatedRoute,
    private _route: Router,
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
    this.auth = {
      user: null,
      jwt: '',
    };
    this.isLoading = false;
    this.cart = { _id: '', items: [] };
    this.productID = this._router.snapshot.paramMap.get('id');
    this.isAdded = false;
    this.selectedAmount = 1;
    this.selectedSize = '';
    this.invalidAmountMessage = '';

    this.addToCartMessage = '';

    this.showGeneral = true;
    this.showDetails = false;
    this.showReviews = false;

    this.showReviewForm = false;

    this.review = {};
    this.reviews = [];

    this.isURLCoppied = false;
  }

  ngOnInit(): void {
    this.auth = this._authService.getUser();
    this.getProduct();
    this.getReviews();
  }

  public async getProduct(): Promise<void> {
    this.isLoading = true;
    const response = await lastValueFrom(
      this._productsService.getProductById(this.productID),
    );

    if (!response.success) {
      alert(response.message);
      return;
    }

    this.isLoading = false;
    this.product = response.product;
  }

  async addToWishlist(): Promise<void> {
    if (this.isOnWishlist()) {
      return;
    }

    //TODO: change this
    let auth = this._authService.getUser();
    let wishlist = [...auth.user.wishlist];
    wishlist = [...wishlist, this.productID];
    auth.user.wishlist = [...wishlist];
    const response = await lastValueFrom(
      this._customerService.editProfile(auth.user._id, auth.user),
    );
    if (!response.success) {
      alert(response.message);
      return;
    }

    this._socketService.emit('wishlist-changes', {
      wishlist: auth.user.wishlist,
    });
    this._authService.update(auth.user);
  }

  public isOnWishlist(): boolean {
    return this.auth.user.wishlist.includes(this.productID);
  }

  public async addToCart(): Promise<void> {
    let auth = this._authService.getUser();
    const response = await lastValueFrom(
      this._cartService.addItem(auth.user.cart._id, this.productID, {
        amount: this.selectedAmount,
        size: this.selectedSize,
      }),
    );

    if (!response.success) {
      alert(response.message);
      return;
    }

    auth.user.cart = response.result;
    this._socketService.emit('cart-changes', { cart: auth.user.cart });
    this._authService.update(auth.user);
  }

  public async removeFromWishlist(): Promise<void> {
    let auth = this._authService.getUser();
    let wishlist = auth.user.wishlist;
    const filtered = wishlist.filter((item: string) => item !== this.productID);
    auth.user.wishlist = [...filtered];
    const response = await lastValueFrom(
      this._customerService.editProfile(auth.user._id, auth.user),
    );

    if (!response.success) {
      alert(response.message);
      return;
    }

    this._socketService.emit('wishlist-changes', { wishlist: filtered });
    this._authService.update(auth.user);
  }

  isProductFavorite(): boolean {
    return false;
  }

  isNegativeOrZero(): void {
    if (this.selectedAmount > +this.product.stock)
      this.selectedAmount = +this.product.stock;
    if (this.selectedAmount <= 0) this.selectedAmount = 1;
  }

  activeDetails(): void {
    this.showGeneral = false;
    this.showDetails = true;
    this.showReviews = false;
  }

  activeGeneral(): void {
    this.showGeneral = true;
    this.showDetails = false;
    this.showReviews = false;
  }

  activeReviews(): void {
    this.showGeneral = false;
    this.showDetails = false;
    this.showReviews = true;
  }

  public returnToLogin(): void {
    this._route.navigate(['/login']);
  }

  optionSelected(): void {
    this.addToCartMessage = '';
  }

  submitReview(form: any): void {}

  getReviews(): void {}

  enableReviewForm(): void {
    this.showReviewForm = true;
  }

  disableReviewForm(): void {
    this.showReviewForm = false;
  }

  scrollToReviews(section: string): void {
    window.location.hash = section;
  }

  copyToClipboard(): void {
    const productURL = window.location.href;

    navigator.clipboard.writeText(productURL).then(
      function () {},
      function (err) {
        console.log('Not copied!');
      },
    );
  }
}
