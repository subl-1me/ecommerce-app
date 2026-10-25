export default interface StripePaymentIntentInput {
  amount: number;
  stripe_pm: string;
  currency: string;
  description: string;
}
