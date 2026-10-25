import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

import { CartService } from 'src/app/services/cart.service';
import { SaleService } from 'src/app/services/sale.service';
import { AddressService } from 'src/app/services/address.service';
import { CheckoutService } from 'src/app/services/checkout.service';
import { AuthService } from 'src/app/services/auth.service';

// Payments
import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';
import { StripeService } from 'src/app/services/stripe.service';

import { Cart } from '../../models/cart';
import { SaleDetails } from 'src/app/models/saleDetail';
import { ShippingInformation } from 'src/app/models/ShippingInformation';
import { Address } from 'src/app/models/address';
import { Coupon } from 'src/app/models/coupon';
import { Auth } from 'src/app/models/auth';
import { Config } from 'src/app/models/config';
import { ConfigsService } from 'src/app/services/configs.service';

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
import CartItem from 'src/app/models/cartItem';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
  providers: [
    CartService,
    CheckoutService,
    AddressService,
    SaleService,
    StripeService,
    ConfigsService,
  ],
})
export class CheckoutComponent implements OnInit {
  // Payments
  public payPalConfig?: IPayPalConfig;
  public form: FormGroup = new FormGroup({});

  public isProcessingPayment: boolean = false;
  public isPaymentSucceeded: boolean = false;
  public paymentStep: number = 0;
  public shippingAux: ShippingInformation = {
    city: '',
    country: '',
    customer: null,
    address: '',
    addressee: '',
    phone: '',
    zip: '',
    email: '',
    state: '',
    default: false,
  };
  public orderDetails: OrderInput = {
    items: [],
    customer: '',
    subtotal: 0,
    total: 0,
    coupon: null,
    discount: 0,
    shippingMethod: '',
    shippingInformation: '',
    paymentProviderName: 'stripe',
    paymentStatus: 'pending',
  };

  public config: Config = {
    categories: [],
    _id: '',
    logo: {
      path: '',
      public_id: '',
    },
    shippingMethods: [],

    shopName: '',
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
  public selectedAddress: Address = {
    _id: '',
    address: '',
    addressee: '',
    country: '',
    principal: false,
    phone: '',
    region: '',
    zip: '',
    province: '',
    district: '',
    dni: '',
  };
  public addresses: ShippingInformation[] = [];
  public directionExists: boolean;

  public shippingCost: number;
  public shippingType: string = 'free';

  public saleDetails: SaleDetails[] = [];

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
    private _addressService: AddressService,
    private _configService: ConfigsService,
    private _couponService: CouponService,
    private _authService: AuthService,
    private _router: Router,
    private fb: FormBuilder,
  ) {
    this.customerID = localStorage.getItem('_id');
    this.cart = {
      items: [],
    };
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
      customer: '',
      addressee: '',
      phone: '',
      email: '',
      default: false,
      address: '',
      state: '',
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
  public toggleSelectedAddress(event?: any) {
    this.orderDetails.shippingInformation;
  }

  private async getAddressList(): Promise<void> {
    const response = await lastValueFrom(
      this._addressService.getAddressListByCustomer(this.auth.user._id),
    );

    if (!response.success) {
      alert(response.message);
      return;
    }

    this.addresses = response.addresses;
    const defaultAddress = response.addresses.find(
      (address: any) => address.default,
    );

    if (!defaultAddress) {
      return;
    }

    this.orderDetails.shippingInformation = defaultAddress._id;
    this.shippingAux = defaultAddress;
    this.selectedAddress = defaultAddress;
  }

  public toggleTargetAddress(_event: any) {
    this.orderDetails.shippingInformation = this.shippingAux._id || '';
  }

  public handlePaymentStatus(event: any) {
    const status = event as boolean;
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
      coupon: null,
      paymentProviderName: '',
      paymentStatus: 'pending',
      shippingMethod: '',
      shippingInformation: '',
      total: 0,
    };
  }

  public handlePaymentSteps(event: any) {
    const step = event as number;
    this.paymentStep = step;
  }

  ngOnInit(): void {
    this.initPaypalConfig();
    this.loadAuthData();
    this.getCart();
    this.getAddressList();
    this.loadConfig();
  }

  private async loadConfig(): Promise<void> {
    const response = await lastValueFrom(this._configService.getShopConfigs());
    if (!response.success) {
      alert(response.message);
      return;
    }

    this.config = response.config;
    const freeShipping = this.config.shippingMethods.find(
      (method) => method.title === 'Free',
    );
    this.orderDetails.shippingMethod = freeShipping?._id || '';
    console.log(this.orderDetails);
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

  public getSelectedShippingMethodTitle(): string {
    return (
      this.config.shippingMethods.find(
        (method) => method.title.toLocaleLowerCase() === this.shippingType,
      )?.title || ''
    );
  }

  public getColorLabel(itemCart: CartItem, hex: string): string {
    const itemVariantColors = itemCart.product.variants.find(
      (variant) => variant.name === 'Color',
    );

    if (!itemVariantColors) {
      return '';
    }

    let label = '';
    for (const value of itemVariantColors.values) {
      label = (value as any).label || ''; // parsing to shut up for a while
    }

    return label;
  }

  public recalculateOrderTotal(): void {
    if (this.coupon.type === GLOBAL.CouponPercentagePrice) {
      this.discount = this.subtotal * (this.coupon.value / 100);
    } else if (this.coupon.type === GLOBAL.CouponFixedPrice) {
      this.discount = this.coupon.value;
    } else {
      this.discount = 0;
    }

    const selectedShippingMethod = this.config.shippingMethods.find(
      (method) => method._id === this.orderDetails.shippingMethod,
    ) || {
      price: 0,
      time: '',
      title: '',
    };
    this.shippingCost = selectedShippingMethod.price || 0;
    // avid discount > subtotal
    this.discount = Math.min(this.discount, this.subtotal);
    this.orderTotal = this.subtotal - this.discount + this.shippingCost;
    this.orderDetails.total = this.orderTotal;
    this.orderDetails.coupon = this.coupon._id ? this.coupon : null;
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
    this.recalculateOrderTotal();
  }

  public async getDefaultAddress(): Promise<void> {
    const response = await lastValueFrom(
      this._addressService.getDefaultAddress(this.auth.user._id),
    );

    if (!response.success) {
      alert(response.message);
      return;
    }

    if (!response.address) {
      return;
    }

    this.selectedAddress = response.address;
    this.form.patchValue({
      address: this.selectedAddress.address,
      zip: this.selectedAddress.zip,
      city: this.selectedAddress.district,
      country: this.selectedAddress.country,
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
