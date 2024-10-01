import { Component, OnInit, DoCheck } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Product } from 'src/app/models/product';
import { Review } from 'src/app/models/review';
import { Cart } from 'src/app/models/cart';

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

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css'],
  providers: [ProductsService, ReviewService, CartService],
})
export class DetailComponent implements OnInit, DoCheck {
  public product: Product;
  public productID: any;

  public cart: Cart;

  public customerID: any;

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
    private _reviewService: ReviewService,
    private _cartService: CartService,
    private _router: ActivatedRoute,
    private _route: Router
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

    this.customerID = localStorage.getItem('_id');

    this.cart = { _id: '' };

    this.productID = this._router.snapshot.paramMap.get('id');
    this.getProduct();

    this.isAdded = false;
    this.selectedAmount = 1;
    this.selectedSize = 'Select Size';
    this.invalidAmountMessage = '';

    this.addToCartMessage = '';

    this.productsFav = JSON.parse(localStorage.getItem('productsFav') || '[]');

    this.showGeneral = true;
    this.showDetails = false;
    this.showReviews = false;

    this.showReviewForm = false;

    this.review = {};
    this.reviews = [];
    this.getReviews();

    this.isURLCoppied = false;
  }

  ngOnInit(): void {}

  ngDoCheck(): void {
    this.isProductFavorite();
  }

  getProduct(): void {
    this._productsService
      .getProductById(this.productID)
      .subscribe((response) => {
        if (!response.product) return;

        this.product = response.product;
      });
  }

  addToFavorite(): void {
    if (!this.productsFav) {
      this.productsFav.push(this.productID);

      localStorage.setItem('productsFav', JSON.stringify(this.productsFav));
      return;
    }

    this.productsFav.push(this.productID);
    localStorage.setItem('productsFav', JSON.stringify(this.productsFav));
  }

  removeFromFavorite(): void {
    this.productsFav = this.productsFav.filter(
      (element: string) => element !== this.productID
    );

    localStorage.setItem('productsFav', JSON.stringify(this.productsFav));
  }

  isProductFavorite(): boolean {
    for (const product of this.productsFav) {
      if (product === this.productID) {
        return true;
      }
    }

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

  // Cart Methods
  addToCart(): void {
    // Case user is not logged
    if (!this.customerID) {
      this.returnToLogin();
      return;
    }

    if (this.selectedSize === 'Select Size') {
      this.addToCartMessage = 'Please, select a size.';
      return;
    }

    if (this.selectedAmount <= 0) {
      this.invalidAmountMessage = 'You must select at least one item.';
      return;
    }

    if (this.addToCartMessage === 'Added!') return;

    this.cart.amount = this.selectedAmount;
    this.cart.size = this.selectedSize;
    this.cart.customer = this.customerID;
    this.cart.product = this.productID;

    this._cartService.addProductTCart(this.cart).subscribe((response) => {
      this.invalidAmountMessage = '';
      this.addToCartMessage = 'Added!';

      setTimeout(() => {
        this.addToCartMessage = '';
      }, 1000);
    });
  }

  public returnToLogin(): void {
    this._route.navigate(['/login']);
  }

  optionSelected(): void {
    this.addToCartMessage = '';
  }

  submitReview(form: any): void {
    this.review.customer = this.customerID;
    this.review.product = this.productID;

    this._reviewService
      .postReview(this.review, this.productID)
      .subscribe((response) => {
        this.getReviews();
        this.disableReviewForm();
        form.reset();
      });
  }

  getReviews(): void {
    this._reviewService.getReviews(this.productID).subscribe((response) => {
      if (!response.reviews) return;

      this.reviews = response.reviews;
      console.log(this.reviews);
    });
  }

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
      }
    );
  }
}
