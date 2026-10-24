import {
  Component,
  OnInit,
  Input,
  Output,
  AfterViewInit,
  EventEmitter,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { environment } from 'src/environments/environment';

import { Auth } from 'src/app/models/auth';
import { OrderInput } from 'src/app/models/order';

// Services
import { SaleService } from 'src/app/services/sale.service';
import { OrderService } from 'src/app/services/order.service';
import { StripeService } from 'src/app/services/stripe.service';
import { AuthService } from 'src/app/services/auth.service';
import { lastValueFrom } from 'rxjs';
import StripePaymentIntentInput from 'src/app/models/stripePaymentIntentInput';

@Component({
  selector: 'app-stripe',
  templateUrl: './stripe.component.html',
  styleUrls: ['./stripe.component.css'],
  providers: [SaleService],
})
export class StripeComponent implements OnInit, AfterViewInit {
  private stripe: Stripe | null = null;
  private stripePaymentMethodIntent: StripePaymentIntentInput = {
    amount: 0,
    description: '',
    currency: 'usd', // default,
    stripe_pm: '',
  };

  @Output() isProcessingPayment = new EventEmitter<boolean>();
  @Output() isPaymentSucceeded = new EventEmitter<boolean>();
  @Output() paymentStep = new EventEmitter<number>();
  @Input() orderDetails: OrderInput = {
    items: [],
    customer: '',
    subtotal: 0,
    address: null,
    total: 0,
    shippingCost: 0,
    shippingMethod: {
      time: '',
      title: '',
      price: 0,
    }, 
    coupon: null,
    discount: 0,
    paymentProviderName: 'stripe',
    paymentStatus: 'pending',
  };

  private elementStripe: any;
  public cardNumber: any;
  public cardCvc: any;
  public cardExp: any;
  public amount: any;

  private auth: Auth = {
    jwt: '',
    user: null,
  };
  public form: FormGroup = new FormGroup({});

  //public stripe: stripe.Stripe;
  constructor(
    private fb: FormBuilder,
    private _stripeService: StripeService,
    private _orderService: OrderService,
    private _authService: AuthService,
  ) {
    this.form = this.fb.group({
      amount: [
        '',
        [Validators.required, Validators.min(1), Validators.max(100000)],
      ],
      cardNumber: [false, [Validators.required, Validators.requiredTrue]],
      cardCvc: [false, [Validators.required, Validators.requiredTrue]],
      cardExp: [false, [Validators.required, Validators.requiredTrue]],
    });
  }

  async ngOnInit(): Promise<void> {
    this.loadAuth();
  }

  async ngAfterViewInit(): Promise<void> {
    this.stripe = await loadStripe(environment.stripe_pk);
    if (this.stripe) {
      this.createStripeElement();
    }
  }

  private loadAuth(): void {
    this.auth = this._authService.getUser();
  }

  private createStripeElement = () => {
    if (!this.stripe) {
      return;
    }

    const style = {
      base: {
        color: '#000000',
        fontWeight: 400,
        fontSize: '20px',
        '::placeholder': {
          color: '#E3E2EC',
        },
      },
      invalid: {
        color: '#dc3545',
      },
    };

    // Stripe's SDK init elements
    this.elementStripe = this.stripe.elements({});

    // Build card's input
    const cardNumber = this.elementStripe.create('cardNumber', {
      placeholder: 'Card number',
      style,
      classes: {
        base: 'input-stripe-custom',
      },
    });
    const cardExp = this.elementStripe.create('cardExpiry', {
      placeholder: 'MM/AA',
      style,
      classes: {
        base: 'input-stripe-custom',
      },
    });
    const cardCvc = this.elementStripe.create('cardCvc', {
      placeholder: 'CVC',
      style,
      classes: {
        base: 'input-stripe-custom',
      },
    });

    // SDK Mount
    cardNumber.mount('#card');
    cardExp.mount('#exp');
    cardCvc.mount('#cvc');

    this.cardNumber = cardNumber;
    this.cardExp = cardExp;
    this.cardCvc = cardCvc;

    // Listen to SDK's events
    this.cardNumber.addEventListener('change', this.onChangeCard.bind(this));
    this.cardCvc.addEventListener('change', this.onChangeCvc.bind(this));
    this.cardExp.addEventListener('change', this.onChangeExp.bind(this));
  };

  onChangeCard({ error }: any) {
    this.form.patchValue({ cardNumber: !error });
  }

  onChangeCvc({ error }: any) {
    this.form.patchValue({ cardCvc: !error });
  }

  onChangeExp({ error }: any) {
    this.form.patchValue({ cardExp: !error });
  }

  async initPay(): Promise<any> {
    try {
      if (!this.stripe) {
        alert('Error initializing Stripe component. Try again later.');
        return;
      }
      this.form.disable();
      this.isProcessingPayment.emit(true);

      this.paymentStep.emit(1);

      // create stripe payment intent
      const orderCreateRes = await lastValueFrom(
        this._orderService.createOrder(this.orderDetails),
      );

      if (!orderCreateRes.success) {
        alert('Error trying to create your order. Try again later.');
        return;
      }

      const order = orderCreateRes.order;
      localStorage.setItem('activeOrderId', order._id);
      // create stripe payment method
      this.paymentStep.emit(2);
      const stripeRes = await this.stripe.createPaymentMethod({
        type: 'card',
        card: this.cardNumber,
      });

      if (stripeRes.error) {
        alert('Error trying to create Stripe Payment Method. Try again later.');
        return;
      }

      // create payment intent
      this.stripePaymentMethodIntent.amount = order.total;
      this.stripePaymentMethodIntent.description = `Testing payment for ${order.customer}`;
      this.stripePaymentMethodIntent.stripe_pm = stripeRes.paymentMethod.id;

      this.paymentStep.emit(3);
      const paymentIntentResponse = await lastValueFrom(
        this._stripeService.createPaymentIntent({
          paymentIntent: this.stripePaymentMethodIntent,
          order: order,
        }),
      );

      if (!paymentIntentResponse.success) {
        alert(`Stripe error: ${paymentIntentResponse.message}`);
        return;
      }

      this.isPaymentSucceeded.emit(true);
      this.isProcessingPayment.emit(false);
    } catch (err) {
      console.log(err);
    }
  }
}
