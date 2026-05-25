import { Inject, Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import * as stripeType from './types/stripe.type';

@Injectable()
export class StripeService extends Stripe {
  public constructor(
    @Inject(stripeType.StripeOptionsSymbol)
    private readonly options: stripeType.TypeStripeOptions,
  ) {
    super(options.apiKey, options.config);
  }
}
