import { Component, OnInit } from '@angular/core';

import { Cart } from '../../models/cart';
import { CartService } from 'src/app/services/cart.service';

import { Sale } from 'src/app/models/sale';
import { SaleService } from 'src/app/services/sale.service';

import { SaleDetails } from 'src/app/models/saleDetail';

import { Direction } from 'src/app/models/direction';
import { DirectionService } from 'src/app/services/direction.service';

import { Shipping } from 'src/app/models/shipping';
import { CheckoutService } from 'src/app/services/checkout.service';

import { CouponApplied } from 'src/app/models/couponApplied';

import { GLOBAL } from 'src/app/services/CONST';

// Payments
import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';
import { StripeService } from 'src/app/services/stripe.service';

// Icons
import { faTrash, faLink, faRefresh } from '@fortawesome/free-solid-svg-icons';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { faCreditCard } from '@fortawesome/free-solid-svg-icons';
import { faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

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

  // Coupons
  public couponApplied: CouponApplied;

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

  public customerID: any;

  public productHrefUrl: string;
  public defaultDirection: Direction;
  public directionExists: boolean;

  public shipping: Array<Shipping>;
  public shippingCost: number;
  public shippingType: any;

  public sale: Sale;
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

  public cart: Array<Cart>;

  public card: any;

  constructor(
    private _cartService: CartService,
    private _directionService: DirectionService,
    private _checkoutService: CheckoutService,
    private _saleService: SaleService,
    private _stripeService: StripeService
  ) {
    this.customerID = localStorage.getItem('_id');
    this.cart = [];
    this.saleDetails = [];
    this.defaultDirection = {};
    this.shipping = [];
    this.shippingCost = 0;
    this.productHrefUrl = GLOBAL.productHrefUrl;

    this.isPaypalSelected = false;
    this.isCCSelected = false;
    this.isShippingSelected = false;

    this.sale = {
      customer: this.customerID,
      transaction: '',
      payment_method: '',
    };

    this.orderTotal = 0;
    this.subtotal = 0;
    this.isOrderComplete = false;

    this.couponCode = '';
    this.couponCodeMessage = '';
    this.couponApplied = { type: '', value: 0, code: '' };

    this.discount = 0;

    this.directionExists = false;
  }

  ngOnInit(): void {
    this.initPaypalConfig();

    this.getCart();
    //this.calculateOrderTotal();
    this.getDefaultDirection();
    this.getShippingMethods();
  }

  generateOrder(): void {
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

  applyCouponCode(): void {
    if (!this.couponCode) return; // Case empty string
    // if(this.couponApplied.find(element => element == this.couponCode) ==  this.couponCode) return; // Case coupon has been applied

    this._checkoutService
      .applyCouponCode(this.couponCode)
      .subscribe((response) => {
        console.log(response);

        if (response.status === 'error') {
          this.couponCodeMessage = 'This code is not valid. Try again.';

          setTimeout(() => {
            this.couponCodeMessage = '';
          }, 1000);

          return;
        }

        this.couponCode = '';
        if ((response.coupon.type = 'Percentage'))
          this.orderTotal = (this.orderTotal * response.coupon.value) / 100;

        this.couponApplied = response.coupon;
        this.discount += this.couponApplied.value;
        //this.couponApplied.push(newCoupon);
      });
  }

  calculateSubtotal(): void {
    for (let item of this.cart) {
      if (item.product?.price && item.amount) {
        this.subtotal += item.product?.price * item.amount;
      }
    }
  }

  calculatePrice(price: any, amount: any): number {
    return price * amount;
  }

  calculateOrderTotal(): void {
    this.orderTotal = 0;
    this.orderTotal += this.subtotal + +this.shippingCost;
    if (this.discount != 0)
      this.orderTotal = (this.orderTotal * this.discount) / 100;
    this.sale.total = this.orderTotal;
  }

  addShippingCost(methodPrice: any, methodType: any) {
    this.isShippingSelected = true;

    // calculate order total
    // if(this.shippingCost != 0 ){
    //   this.orderTotal -= this.shippingCost;
    // }
    // if(this.shippingCost == 0){
    this.calculateOrderTotal();
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

  getCart(): void {
    if (!this.customerID) return;

    this._cartService.getCart(this.customerID).subscribe((response) => {
      if (!response.cart) return;

      console.log(response);
      this.cart = response.cart;

      if (this.subtotal == 0) this.calculateSubtotal();
      this.calculateOrderTotal();

      this.saleDetails = [];
      this.getSaleDetails();
    });
  }

  getSaleDetails(): void {
    this.cart.forEach((item) => {
      this.saleDetails.push({
        product: item.product?._id,
        customer: this.customerID,
        subtotal: item.product?.price,
        variety: item.size,
        amount: item.amount,
        sale: '',
      });
    });

    this.sale.details = this.saleDetails;
    console.log(this.saleDetails);
  }

  deleteProductCart(productID: any): void {
    this._cartService.removeProductCart(productID).subscribe((response) => {
      this.orderTotal = 0;
      this.getCart();
    });
  }

  getDefaultDirection(): void {
    if (!this.customerID) return;
    this._directionService
      .getDefaultDirection(this.customerID)
      .subscribe((response) => {
        if (!response.direction) {
          this.directionExists = false;
        }

        this.directionExists = true;
        this.defaultDirection = response.direction;

        this.sale.shippingAddress = this.defaultDirection;
      });
  }

  getShippingMethods(): void {
    this._checkoutService.getShippingMethods().subscribe((response) => {
      this.shipping = response;
    });
  }

  paypalSelected() {
    var ccMethod = document.getElementById('cc-input') as HTMLInputElement;
    ccMethod.checked = false;

    this.isPaypalSelected = true;
    this.isCCSelected = false;
  }

  ccSelected() {
    var paypalMethod = document.getElementById(
      'paypal-input'
    ) as HTMLInputElement;
    paypalMethod.checked = false;

    this.isPaypalSelected = false;
    this.isCCSelected = true;
  }

  completeOrder(): void {
    this.generateOrder();
    this.isOrderComplete = true;
  }

  undoOrderComplete(): void {
    this.isOrderComplete = false;
  }

  removeCoupon(): void {
    // RESET coupon
    this.couponApplied = {
      value: 0,
      type: '',
      code: '',
    };

    this.discount = 0;
    this.calculateOrderTotal();
  }
}
