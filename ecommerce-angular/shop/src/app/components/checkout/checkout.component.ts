import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

import { CartService } from 'src/app/services/cart.service';
import { SaleService } from 'src/app/services/sale.service';
import { DirectionService } from 'src/app/services/direction.service';
import { CheckoutService } from 'src/app/services/checkout.service';
import { AuthService } from 'src/app/services/auth.service';

// Payments
import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';
import { StripeService } from 'src/app/services/stripe.service';

import { Cart } from '../../models/cart';
import { SaleDetails } from 'src/app/models/saleDetail';
import { ShippingInformation } from 'src/app/models/ShippingInformation';
import { Direction } from 'src/app/models/direction';
import { Shipping } from 'src/app/models/shipping';
import { Coupon } from 'src/app/models/coupon';
import { Auth } from 'src/app/models/auth';

import { GLOBAL } from 'src/app/services/CONST';
import { environment } from 'src/environments/environment';

// Icons
import {
  faTrash,
  faLink,
  faRefresh,
  faChevronDown,
} from '@fortawesome/free-solid-svg-icons';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { faCreditCard } from '@fortawesome/free-solid-svg-icons';
import { faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { lastValueFrom } from 'rxjs';
import { CouponService } from 'src/app/services/coupon.service';
import { OrderInput } from 'src/app/models/order';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
  providers: [
    CartService,
    CheckoutService,
    DirectionService,
    SaleService,
    StripeService,
  ],
})
export class CheckoutComponent implements OnInit {
  // Payments
  public payPalConfig?: IPayPalConfig;
  public form: FormGroup = new FormGroup({});

  public isProcessingPayment: boolean = false;
  public isPaymentSucceeded: boolean = false;
  public paymentStep: number = 0;
  orderDetails: OrderInput = {
    items: [],
    customer: '',
    address: null,
    subtotal: 0,
    total: 0,
    shippingCost: 0,
    coupon: null,
    discount: 0,
    paymentProviderName: 'stripe',
    paymentStatus: 'pending',
  };

  // Coupons
  public coupon: Coupon = {
    value: 0,
    limit: 0,
    code: '',
    type: '',
  };
  public shippingInformation: ShippingInformation;

  // Icons

  faTrash = faTrash;
  faEye = faEye;
  faHeart = faHeart;
  faCreditCard = faCreditCard;
  faArrowDown = faArrowDown; //
  faXmark = faXmark;
  faCheck = faCheck;
  faLink = faLink;
  faRefresh = faRefresh;
  faChevronDown = faChevronDown;

  public customerID: any;
  public auth: Auth = {
    jwt: '',
    user: null,
  };

  public percentageTypeTemplate = GLOBAL.CouponPercentagePrice;
  public fixedTypeTemplate = GLOBAL.CouponFixedPrice;

  public productHrefUrl: string;
  public defaultDirection: Direction;
  public directionExists: boolean;

  public shipping: Array<Shipping>;
  public shippingCost: number;
  public shippingType: string = 'free';

  public saleDetails: Array<SaleDetails>;

  public orderTotal: number;
  public subtotal: number;
  public isOrderComplete: boolean;

  public isPaypalSelected: boolean;
  public isCCSelected: boolean;
  public isShippingSelected: boolean;

  public couponCode: string;
  public couponCodeMessage: string;

  public discount: number;

  public cart: Cart;
  public card: any;

  constructor(
    private _cartService: CartService,
    private _directionService: DirectionService,
    private _checkoutService: CheckoutService,
    private _couponService: CouponService,
    private _authService: AuthService,
    private _router: Router,
    private fb: FormBuilder,
  ) {
    this.customerID = localStorage.getItem('_id');
    this.cart = {
      items: [],
    };
    this.saleDetails = [];
    this.defaultDirection = {};
    this.shipping = [];
    this.shippingCost = 0;
    this.productHrefUrl = environment.API_URL || GLOBAL.localUrl;

    this.isPaypalSelected = false;
    this.isCCSelected = false;
    this.isShippingSelected = false;

    this.form = this.fb.group({
      address: [
        '',
        [Validators.required, Validators.min(1), Validators.max(100000)],
      ],
      email: ['', [Validators.required, Validators.requiredTrue]],
      country: ['', [Validators.required, Validators.requiredTrue]],
      city: ['', [Validators.required, Validators.requiredTrue]],
      zip: ['', [Validators.required, Validators.requiredTrue]],
    });

    this.shippingInformation = {
      address: '',
      city: '',
      country: '',
      zip: '',
    };

    this.orderTotal = 0;
    this.subtotal = 0;
    this.isOrderComplete = false;

    this.couponCode = '';
    this.couponCodeMessage = '';

    this.discount = 0;

    this.directionExists = false;
  }

  public handlePaymentStatus(event: any) {
    const status = event as boolean;
    console.log(event);
    this.isProcessingPayment = status;
  }

  public async handlePaymentSucceeded(event: any) {
    const status = event as boolean;
    this.isPaymentSucceeded = status;

    this.resetOrder();
    // delete cart
    const response = await lastValueFrom(
      this._cartService.emptyCart(this.cart._id || ''),
    );

    if (!response.success) {
      alert(response.message);
      return;
    }

    // reset cart
    this.auth.user.cart.items = [];
    this._authService.update(this.auth.user);
  }

  public handleNavigation(action: string): void {
    switch (action) {
      case 'continue-shopping':
        localStorage.removeItem('activeOrderId');
        this._router.navigate(['/products']);
        break;
      case 'order-details':
        const orderId = localStorage.getItem('activeOrderId') || '';
        localStorage.removeItem('activeOrderId');
        this._router.navigate(['/order', orderId]);
        break;
      default:
        break;
    }
  }

  private resetOrder(): void {
    this.orderDetails = {
      customer: '',
      items: [],
      subtotal: 0,
      discount: 0,
      address: null,
      coupon: null,
      paymentProviderName: '',
      paymentStatus: 'pending',
      shippingCost: 0,
      total: 0,
    };
  }

  public handlePaymentSteps(event: any) {
    const step = event as number;
    this.paymentStep = step;
  }

  ngOnInit(): void {
    // this.initPaypalConfig();
    this.loadAuthData();
    this.getCart();
    this.getDefaultAddress();
    this.recalculateOrderTotal();
    this.getShippingMethods();
  }

  private loadAuthData(): void {
    this.auth = this._authService.getUser();
    this.orderDetails.customer = this.auth.user._id;
    this.form.patchValue({ email: this.auth.user.email });
  }

  private initPaypalConfig(): void {
    this.payPalConfig = {
      currency: 'EUR',
      clientId:
        'AfyBHRTMhFarycyF0C2K4BnpJiMYdnFHLiQ3EfdqfDQ8kcyE2FOynzSveJcjT9TiWn8vl5_ghRPY4tNU',
      createOrderOnClient: (data) =>
        <ICreateOrderRequest>{
          intent: 'CAPTURE',
          purchase_units: [
            {
              amount: {
                currency_code: 'EUR',
                value: '9.99',
                breakdown: {
                  item_total: {
                    currency_code: 'EUR',
                    value: '9.99',
                  },
                },
              },
              items: [
                {
                  name: 'Enterprise Subscription',
                  quantity: '1',
                  category: 'DIGITAL_GOODS',
                  unit_amount: {
                    currency_code: 'EUR',
                    value: '9.99',
                  },
                },
              ],
            },
          ],
        },
      advanced: {
        commit: 'true',
        extraQueryParams: [
          { name: 'disable-funding', value: 'card,mercadopago' },
        ],
      },
      style: {
        label: 'paypal',
        layout: 'vertical',
      },
      onApprove: (data, actions) => {
        actions.order.get().then((details: any) => {});
      },
      onError: (err) => {
        console.log(err);
      },
    };
  }

  public async verifyCouponCode(): Promise<void> {
    const response = await lastValueFrom(
      this._couponService.getCuponByCode(this.couponCode),
    );
    if (!response.success) {
      alert(response.message);
      return;
    }

    this.coupon = response.coupon;
    this.recalculateOrderTotal();
  }

  public recalculateOrderTotal(): void {
    if (this.coupon.type === GLOBAL.CouponPercentagePrice) {
      this.discount = this.subtotal * (this.coupon.value / 100);
    } else if (this.coupon.type === GLOBAL.CouponFixedPrice) {
      this.discount = this.coupon.value;
    } else {
      this.discount = 0;
    }

    if (this.shippingType === GLOBAL.FreeShippingStatement) {
      this.shippingCost = 0;
    } else if (this.shippingType === GLOBAL.StandardShippingStatement) {
      this.shippingCost = 5;
    } else if (this.shippingType === GLOBAL.ExpressShippingStatement) {
      this.shippingCost = 15;
    } else {
      this.shippingCost = 0;
    }

    // avid discount > subtotal
    this.discount = Math.min(this.discount, this.subtotal);
    this.orderTotal = this.subtotal - this.discount + this.shippingCost;
    this.orderDetails.total = this.orderTotal;
    this.orderDetails.coupon = this.coupon._id ? this.coupon : null;
    this.orderDetails.shippingCost = this.shippingCost;
    this.orderDetails.discount = this.discount;
  }

  public calculateOrderSubTotal(): void {
    this.subtotal = this.cart.items.reduce((accum, current) => {
      return (accum += current.product.price * current.qty);
    }, 0);
    this.orderDetails.subtotal = this.subtotal;
  }

  public calculatePriceTimesQty(price: number, amount: number): number {
    return price * amount;
  }

  public async getCart(): Promise<void> {
    const response = await lastValueFrom(
      this._cartService.getCart(this.auth.user.cart._id),
    );
    if (!response.success) {
      alert(response.message);
      return;
    }

    this.cart = response.cart;
    this.orderDetails.items = [...this.cart.items];
    this.orderDetails.customer = this.auth.user._id;
    this.calculateOrderSubTotal();
  }

  public async getDefaultAddress(): Promise<void> {
    const response = await lastValueFrom(
      this._directionService.getDefaultAddress(this.auth.user._id),
    );

    if (!response.success) {
      alert(response.message);
      return;
    }

    if (!response.address) {
      return;
    }

    this.defaultDirection = response.address;
    this.orderDetails.address = response.address;
    this.form.patchValue({
      address: this.defaultDirection.address,
      zip: this.defaultDirection.zip,
      city: this.defaultDirection.district,
      country: this.defaultDirection.country,
    });
  }

  public getShippingMethods(): void {
    this._checkoutService.getShippingMethods().subscribe((response) => {
      this.shipping = response;
    });
  }

  public paypalSelected() {
    var ccMethod = document.getElementById('cc-input') as HTMLInputElement;
    ccMethod.checked = false;

    this.isPaypalSelected = true;
    this.isCCSelected = false;
  }

  public ccSelected() {
    var paypalMethod = document.getElementById(
      'paypal-input',
    ) as HTMLInputElement;
    paypalMethod.checked = false;

    this.isPaypalSelected = false;
    this.isCCSelected = true;
  }

  public removeCoupon(): void {
    // RESET coupon
    this.coupon = {
      value: 0,
      type: '',
      code: '',
      limit: 0,
    };

    this.discount = 0;
    this.recalculateOrderTotal();
  }
}
