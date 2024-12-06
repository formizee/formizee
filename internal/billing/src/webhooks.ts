type Event =
  | 'subscription_created'
  | 'subscription_updated'
  | 'subscription_cancelled'
  | 'subscription_resumed'
  | 'subscription_expired'
  | 'subscription_paused'
  | 'subscription_unpaused'
  | 'subscription_payment_failed'
  | 'subscription_payment_success'
  | 'subscription_payment_recovered'
  | 'subscription_payment_refund';

export interface Webhook {
  meta: {
    event_name: Event;
    test_mode: boolean;
    webhook_id: string;
    custom_data: Record<string, string>;
  };
  data: {
    attributes: {
      subscription_id: number;
      customer_id: number;
      cancelled: boolean;
      renews_at: string;
      ends_at: string | null;
    };
  };
}
