import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';

// Services
import { StripeService } from 'src/app/services/stripe.service';

@Component({
  selector: 'app-stripe',
  templateUrl: './stripe.component.html',
  styleUrls: ['./stripe.component.css']
})
export class StripeComponent implements OnInit {
  private readonly stripe: any; // window.stripe
  private elementStripe: any;
  public cardNumber: any;
  public cardCvc: any;
  public cardExp: any;
  public amount: any;

  public form: FormGroup = new FormGroup({});

  //public stripe: stripe.Stripe;
  constructor(
    private fb: FormBuilder,
    private _stripeService: StripeService
  ) {
    this.stripe = window.Stripe(environment.stripe_pk);
    this.form = this.fb.group({
      amount: ['', [Validators.required, Validators.min(1), Validators.max(100000)]],
      cardNumber: [false, [Validators.required, Validators.requiredTrue]],
      cardCvc: [false, [Validators.required, Validators.requiredTrue]],
      cardExp: [false, [Validators.required, Validators.requiredTrue]],
    })
   }

  ngOnInit():void {
    this.createStripeElement();
  }

  private createStripeElement = () => {
    const style = {
      base: {
        color: '#000000',
        fontWeight: 400,
        fontSize: '20px',
        '::placeholder':{
          color: '#E3E2EC',
        }
      },
      invalid:{
        color: '#dc3545'
      },
    }

    // Stripe's SDK init elements
    this.elementStripe = this.stripe.elements({});

    // Build card's input
    const cardNumber = this.elementStripe.create('cardNumber', 
    { 
      placeholder: '4242 4242 4242 4242',
      style,
      classes: {
        base: 'input-stripe-custom',
      }
    });
    const cardExp = this.elementStripe.create('cardExpiry', 
    { 
      placeholder: 'MM/AA',
      style,
      classes: {
        base: 'input-stripe-custom',
      }
    });
    const cardCvc = this.elementStripe.create('cardCvc',
    {
      placeholder: '000',
      style,
      classes: {
        base: 'input-stripe-custom',
      }
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
  }

  onChangeCard({error}: any) {
    this.form.patchValue({cardNumber: !error});
  }

  onChangeCvc({error}: any) {
    this.form.patchValue({cardCvc: !error});
  }

  onChangeExp({error}: any) {
    this.form.patchValue({cardExp: !error});
  }

  async initPay(): Promise<any>{
    try{
      this.form.disable();

      // Stripe's SDK generate token
      const { token } = await this.stripe.createToken(this.cardNumber);

      // Send token to API 
      // Get client_secret token for stripe
      const orderID = localStorage.getItem('orderID');
      if(!orderID){
        console.log('Error trying to verify your order.');
        return;
      }
      
      const { data } = await this._stripeService.sendPayment(orderID, token.id);

      // STRIPE SDK will verify bank auth
      this.stripe.handleCardPayment(data.client_secret)
        .then(async () => {
          // Payment success
          console.log('Payment Success');
          console.log(data);

          // Confirm order status
          // await this._stripeService.confirmOrder(orderID);
          this.stripe.confirmCardPayment(data.client_secret);
        }).catch(() => {
          console.log('Payment Error');
        })

      
    }catch(err){
      console.log(err);
    }
  }

}
