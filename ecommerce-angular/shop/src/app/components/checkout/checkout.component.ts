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


// Payments
import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';
import { StripeService } from 'src/app/services/stripe.service';

// Icons
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { faCreditCard } from '@fortawesome/free-solid-svg-icons';
import { faArrowDown } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
  providers: [ CartService, CheckoutService, DirectionService, SaleService, StripeService ]
})
export class CheckoutComponent implements OnInit {

  // Payments
  public payPalConfig ? : IPayPalConfig;

  // Icons

  faTrash = faTrash;
  faEye = faEye;
  faHeart = faHeart;
  faCreditCard = faCreditCard;
  faArrowDown = faArrowDown; //

  public customerID: any;

  public defaultDirection: Direction;

  public shipping: Array<Shipping>;
  public shippingCost: number;
  public shippingType: any;

  public sale: Sale;
  public saleDetails: Array<SaleDetails>;

  public orderTotal: number;
  public subtotal: number;

  public isPaypalSelected: boolean;
  public isCCSelected: boolean;
  public isSaleCompleted: boolean;
  public isShippingSelected: boolean;

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

    this.isPaypalSelected = false;
    this.isCCSelected = false;
    this.isShippingSelected = false;

    this.sale = {customer: this.customerID};
    this.orderTotal = 0;
    this.subtotal = 0;
    this.isSaleCompleted = false;
  }

  ngOnInit(): void {
    this.initPaypalConfig();
    this.generateOrder();

    this.getCart();
    this.getDefaultDirection();
    this.getShippingMethods(); 
  }

  generateOrder():void{
    var orderData = { id: this.customerID, amount: 40 }
    this._stripeService.generateOrder(orderData).subscribe((response) => {
      if(!response.data._id) return;

      localStorage.setItem('orderID', response.data._id);

    })
    
    /*this._stripeService.getOrder().subscribe((response) => {
      console.log(response);
    })*/
  }

  private initPaypalConfig():void{
    this.payPalConfig = {
        currency: 'EUR',
        clientId: 'AfyBHRTMhFarycyF0C2K4BnpJiMYdnFHLiQ3EfdqfDQ8kcyE2FOynzSveJcjT9TiWn8vl5_ghRPY4tNU',
        createOrderOnClient: (data) => < ICreateOrderRequest > {
            intent: 'CAPTURE',
            purchase_units: [{
                amount: {
                    currency_code: 'EUR',
                    value: '9.99',
                    breakdown: {
                        item_total: {
                            currency_code: 'EUR',
                            value: '9.99'
                        }
                    }
                },
                items: [{
                    name: 'Enterprise Subscription',
                    quantity: '1',
                    category: 'DIGITAL_GOODS',
                    unit_amount: {
                        currency_code: 'EUR',
                        value: '9.99',
                    },
                }]
            }]
        },
        advanced: {
            commit: 'true',
            extraQueryParams: [{ name: 'disable-funding', value: 'card,mercadopago' }],
        },
        style: {
            label: 'paypal',
            layout: 'vertical'
        },
        onApprove: (data, actions) => {
          actions.order.get().then((details:any) => {

              this.sale.customer = this.customerID;
              this.sale.shippingAddress = this.defaultDirection;
              this.sale.shippingPrice = this.shippingCost;
              this.sale.shippingType = this.shippingType;
              this.sale.transaction = details.id;
              this.sale.subtotal = this.subtotal;
              this.sale.status = '';
              this.sale.details = this.saleDetails;

              this._saleService.registerCustomerSale(this.sale).subscribe((response) => {
                if(response.status !== 'SUCCESS') return;

                console.log(response);
                this._saleService.sendEmailSale(response.saleRegister._id).subscribe((response) => {
                  console.log(response);
                });
                this.isSaleCompleted = true;
              })
          });

        },
        onError: (err) => {
          console.log(err);
        },

    }
  }

  calculateSubtotal():void{
    for(let item of this.cart){
      if(item.product?.price) this.subtotal += item.product?.price;
    }
  }

  calculatePrice(price:any, amount:any):number{
    return price * amount;
  }

  calculateOrderTotal():void{
    this.orderTotal += this.subtotal;
  }

  addShippingCost(methodPrice:any, methodType:any){
    this.isShippingSelected = true;
    this.getCart();
    this.orderTotal += parseInt(methodPrice);
    this.shippingType = methodType;


    this.calculateOrderTotal();
    console.log(this.orderTotal);
    // create payment intent (stripe)
    /*this._stripeService.createPaymentIntent(this.orderTotal).subscribe((response) => {
      if(!response.intent.client_secret) return;

      localStorage.setItem('current_intent', response.intent.client_secret);

    })*/
  }

  getCart():void{
    this._cartService.getCart(this.customerID).subscribe((response) => {
      if(!response.cart) return;

      this.cart = response.cart;

      this.calculateSubtotal();
      this.calculateOrderTotal();

      this.saleDetails = [];
      this.getSaleDetails();
    })

  }

  getSaleDetails():void{
    this.cart.forEach(item =>{
      this.saleDetails.push({
        product: item.product?._id,
        customer: this.customerID,
        subtotal: item.product?.price,
        variety: item.size,
        amount: item.amount,
        sale: ''
      });
    })

    console.log(this.saleDetails);
  }

  deleteProductCart(productID:any):void{
    this._cartService.removeProductCart(productID).subscribe((response) => {
      this.orderTotal = 0;
      this.getCart();
    })
  }

  getDefaultDirection():void{
    this._directionService.getDefaultDirection(this.customerID).subscribe((response) => {
      if(!response.direction) return;


      this.defaultDirection = response.direction;
    })
  }

  getShippingMethods():void{
    this._checkoutService.getShippingMethods().subscribe((response) => {
      this.shipping = response;
    })
  }

  paypalSelected(){
    var ccMethod = document.getElementById('cc-input') as HTMLInputElement;
    ccMethod.checked = false;

    this.isPaypalSelected = true;
    this.isCCSelected = false;
  }

  ccSelected(){
    var paypalMethod = document.getElementById('paypal-input') as HTMLInputElement;
    paypalMethod.checked = false;

    this.isPaypalSelected = false;
    this.isCCSelected = true;
  }
}
