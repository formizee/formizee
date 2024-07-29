export type APIKeyExpirationDate =
  | '1-day'
  | '7-days'
  | '30-days'
  | '60-days'
  | '90-days'
  | '180-days'
  | '1-year'
  | 'never';

export const APIKeyExpirationDateEnum = [
  '1-day',
  '7-days',
  '30-days',
  '60-days',
  '90-days',
  '180-days',
  '1-year',
  'never'
] as const;

export type APIKeyScope = 'full-access' | 'team';

export const APIKeyScopeEnum = ['full-access', 'team'] as const;
