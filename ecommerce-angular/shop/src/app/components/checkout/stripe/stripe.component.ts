import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';

import { Sale } from 'src/app/models/sale';
import { SaleService } from 'src/app/services/sale.service';

// Services
import { StripeService } from 'src/app/services/stripe.service';

@Component({
  selector: 'app-stripe',
  templateUrl: './stripe.component.html',
  styleUrls: ['./stripe.component.css'],
  providers: [SaleService],
})
export class StripeComponent implements OnInit {
  @Input() sale: Sale;

  private readonly stripe: any; // window.stripe
  private elementStripe: any;
  public cardNumber: any;
  public cardCvc: any;
  public cardExp: any;
  public amount: any;

  public isPaymentSucceeded: boolean;

  public form: FormGroup = new FormGroup({});

  //public stripe: stripe.Stripe;
  constructor(
    private fb: FormBuilder,
    private _stripeService: StripeService,
    private _saleService: SaleService
  ) {
    //this.stripe = window.Stripe(environment.stripe_pk);
    this.stripe = window.Stripe(
      'pk_test_51L1yDyIX0ejDpXz2xriFFkc2ov5XmwysFD5u0BAJJbtt5RLUnxKJY5X0QWVW4gqYxaukYilaFyA8OBPFMtNE2KfS005oWRzBCH'
    );
    this.form = this.fb.group({
      amount: [
        '',
        [Validators.required, Validators.min(1), Validators.max(100000)],
      ],
      cardNumber: [false, [Validators.required, Validators.requiredTrue]],
      cardCvc: [false, [Validators.required, Validators.requiredTrue]],
      cardExp: [false, [Validators.required, Validators.requiredTrue]],
    });

    this.sale = {};
    this.isPaymentSucceeded = false;
  }

  ngOnInit(): void {
    console.log(this.sale);
    this.createStripeElement();
  }

  private createStripeElement = () => {
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
      this.form.disable();

      // Stripe's SDK generate token
      const { token } = await this.stripe.createToken(this.cardNumber);

      // Send token to API
      // Get client_secret token for stripe
      const orderID = localStorage.getItem('orderID');
      if (!orderID) {
        console.log('Error trying to verify your order.');
        return;
      }

      // Update current Order adding stripe's ID field
      const { data } = await this._stripeService.sendPayment(orderID, token.id);

      // STRIPE SDK will verify bank auth
      this.stripe
        .handleCardPayment(data.client_secret)
        .then(async () => {
          if (data.status !== 'requires_confirmation') return;

          // Payment success
          console.log('Payment Success');
          this.isPaymentSucceeded = true;

          // delete actual order
          this._stripeService.confirmOrder(orderID).subscribe((response) => {
            console.log(response);
          });

          // Register sale
          this.sale.payment_method = 'Card';
          this.sale.transaction = data.id;
          this._saleService
            .registerCustomerSale(this.sale)
            .subscribe((response) => {
              if (response.status !== 'SUCCESS') return;

              this._saleService
                .sendEmailSale(response.saleRegister._id)
                .subscribe((response) => {
                  console.log(response);
                });

              console.log(response);
            });

          // Confirm order status
          // await this._stripeService.confirmOrder(orderID);
          //this.stripe.confirmCardPayment(data.client_secret);
        })
        .catch(() => {
          console.log('Payment Error');
        });
    } catch (err) {
      console.log(err);
    }
  }
}
