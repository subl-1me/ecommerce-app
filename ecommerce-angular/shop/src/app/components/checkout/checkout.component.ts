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
import { Sale } from 'src/app/models/sale';
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
import { Order } from 'src/app/models/order';
import { lastValueFrom } from 'rxjs';
import { CouponService } from 'src/app/services/coupon.service';

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

  public sale: Sale;
  public saleDetails: Array<SaleDetails>;
  public currentOrder: Order;

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
    private _saleService: SaleService,
    private _stripeService: StripeService,
    private _authService: AuthService,
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

    this.sale = {
      customer: this.customerID,
      transaction: '',
      payment_method: '',
    };

    this.currentOrder = {
      _id: '',
      amount: 0,
      customerID: '',
      status: 'wait',
      createAt: '',
      updatedAt: '',
    };

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

  ngOnInit(): void {
    // this.initPaypalConfig();
    this.loadAuthData();
    this.getCart();
    this.getDefaultAddress();
    this.getShippingMethods();
    // this.getActiveOrder();
  }

  private loadAuthData(): void {
    this.auth = this._authService.getUser();
    this.form.patchValue({ email: this.auth.user.email });
  }

  public generateOrder(): void {
    if (!this.customerID) return;

    var orderData = { id: this.customerID, amount: this.orderTotal };
    this._stripeService.generateOrder(orderData).subscribe((response) => {
      //if(!response.data._id) return;

      const orderId = response.data._id;
      localStorage.setItem('orderID', orderId);
    });

    /*this._stripeService.getOrder().subscribe((response) => {
      console.log(response);
    })*/
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
        actions.order.get().then((details: any) => {
          this.sale.shippingPrice = this.shippingCost;
          this.sale.transaction = details.id;
          this.sale.total = this.orderTotal;
          this.sale.status = 'Success';
          this.sale.payment_method = 'Paypal';

          this._saleService
            .registerCustomerSale(this.sale)
            .subscribe((response) => {
              if (response.status !== 'SUCCESS') return;

              this._saleService
                .sendEmailSale(response.saleRegister._id)
                .subscribe((response) => {
                  console.log(response);
                });
              // this.isSaleCompleted = true;
            });
        });
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
  }

  public calculateOrderSubTotal(): void {
    this.subtotal = this.cart.items.reduce((accum, current) => {
      return (accum += current.product.price * current.qty);
    }, 0);
  }

  public calculatePriceTimesQty(price: number, amount: number): number {
    return price * amount;
  }

  public calculateSubOrderTotal(): void {
    // this.orderTotal += subtotal + this.shippingCost;
    // if (this.discount != 0)
    //   this.orderTotal = (this.orderTotal * this.discount) / 100;
    // this.sale.total = this.orderTotal;
  }

  public addShippingCost(methodPrice: any, methodType: any) {
    this.isShippingSelected = true;

    // calculate order total
    // if(this.shippingCost != 0 ){
    //   this.orderTotal -= this.shippingCost;
    // }
    // if(this.shippingCost == 0){
    // this.calculateOrderTotal();
    this.sale.shippingPrice = this.shippingCost;
    this.sale.shippingType = methodType;
    //   return;
    // }
    // this.orderTotal += +this.shippingCost;

    // this.orderTotal += parseInt(methodPrice);
    // this.shippingType = methodType;

    // this.calculateOrderTotal();
    // console.log(this.orderTotal);

    // create payment intent (stripe)
    // this._stripeService.createPaymentIntent(this.orderTotal, this.customerID, methodType).subscribe((response) => {
    //   console.log(response);
    //   if(!response.intent.client_secret) return;

    //   localStorage.setItem('current_intent', response.intent.client_secret);

    // })
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
    this.calculateOrderSubTotal();
  }

  // getSaleDetails(): void {
  //   this.cart.forEach((item) => {
  //     this.saleDetails.push({
  //       product: item.product?._id,
  //       customer: this.customerID,
  //       subtotal: item.product?.price,
  //       variety: item.size,
  //       amount: item.amount,
  //       sale: '',
  //     });
  //   });

  //   this.sale.details = this.saleDetails;
  //   console.log(this.saleDetails);
  // }

  deleteProductCart(productID: any): void {}

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

  public async getActiveOrder(): Promise<any> {
    this._stripeService
      .getActiveOrder(this.customerID)
      .subscribe((response) => {
        if (response.currentCustomerOrder) {
          this.currentOrder = response.currentCustomerOrder;
        }
      });
  }

  public completeOrder(): void {
    // this.generateOrder();
    this.isOrderComplete = true;
  }

  public undoOrderComplete(): void {
    this.isOrderComplete = false;
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
