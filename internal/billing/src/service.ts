import Stripe from 'stripe';

export class BillingService {
  readonly stripe: Stripe;
  private readonly testMode: boolean;

  private readonly FORMIZEE_PRO_PRICE = 'price_1QhEPbEwRlAi5vvJykRZbVz0';
  private readonly FORMIZEE_PRO_TEST_PRICE = 'price_1QhERkEwRlAi5vvJadjNrZ0h';

  constructor(opts?: {apiKey: string; testMode?: boolean}) {
    this.testMode = opts?.testMode ?? false;

    this.stripe = new Stripe(opts?.apiKey ?? '', {
      apiVersion: '2024-12-18.acacia',
      appInfo: {
        name: 'Formizee.',
        url: 'https://dashboard.formizee.com'
      }
    });
  }

  public buildWebhookEvent(body: string, signature: string, secret: string) {
    return this.stripe.webhooks.constructEvent(body, signature, secret);
  }

  public async getStripeCustomer(id: string): Promise<Stripe.Customer | null> {
    const result = await this.stripe.customers.retrieve(id);

    if (result.deleted) {
      return Promise.resolve(null);
    }

    return Promise.resolve(result);
  }

  public async createFormizeeProPlanCheckout(input: {
    email: string;
    cancelUrl: string;
    successUrl: string;
    workspaceId: string;
    stripeId: string | null;
  }) {
    let customerId = input.stripeId;

    if (customerId === null) {
      const customer = await this.stripe.customers.create({
        email: input.email,
        metadata: {
          workspaceId: input.workspaceId
        }
      });
      customerId = customer.id;
    }

    const newCheckout = await this.stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [
        {
          quantity: 1,
          price: this.testMode
            ? this.FORMIZEE_PRO_TEST_PRICE
            : this.FORMIZEE_PRO_PRICE
        }
      ],
      customer: customerId,
      cancel_url: input.cancelUrl,
      success_url: input.successUrl
    });

    return Promise.resolve(newCheckout.url);
  }

  public async getFormizeeSubscriptionPortalUrl(customerId: string) {
    const session = await this.stripe.billingPortal.sessions.create({
      customer: customerId
    });
    return Promise.resolve(session.url);
  }
}
