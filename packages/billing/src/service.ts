import {
  type NewCheckout,
  lemonSqueezySetup,
  createCheckout,
  listSubscriptionInvoices,
  cancelSubscription,
  getSubscriptionInvoice,
  getSubscription
} from '@lemonsqueezy/lemonsqueezy.js';

export class BillingService {
  constructor(opts?: {apiKey: string}) {
    lemonSqueezySetup({
      apiKey: opts?.apiKey,
      onError: error => console.error('Billing Error: ', error)
    });
  }

  public async createFormizeeProPlanCheckout(
    input: {
      email: string;
      storeId: string;
      variantId: string;
      workspaceId: string;
      redirectUrl: string;
    },
    opts?: {testMode: boolean}
  ) {
    const newCheckout: NewCheckout = {
      productOptions: {
        redirectUrl: input.redirectUrl,
        receiptButtonText: 'Go to Dashboard'
      },
      checkoutOptions: {
        embed: false
      },
      checkoutData: {
        email: input.email,
        custom: {
          workspaceId: input.workspaceId
        }
      },
      testMode: opts?.testMode ?? false
    };

    const {data, error} = await createCheckout(
      input.storeId,
      input.variantId,
      newCheckout
    );

    if (!data) {
      return Promise.reject(error);
    }

    return Promise.resolve(data.data.attributes.url);
  }

  public async getFormizeeSubscriptionPortalUrl(subscriptionId: string) {
    const {data, error} = await getSubscription(subscriptionId);

    if (!data) {
      return Promise.reject(error);
    }

    return Promise.resolve(data.data.attributes.urls.customer_portal);
  }

  public async cancelFormizeeProPlanSubscription(subscriptionId: string) {
    return await cancelSubscription(subscriptionId);
  }

  public async getFormizeePlanInvoice(subscriptionInvoiceId: string) {
    return await getSubscriptionInvoice(subscriptionInvoiceId);
  }

  public async listFormizeePlanInvoices(subscriptionId: string) {
    return await listSubscriptionInvoices({filter: {subscriptionId}});
  }
}
