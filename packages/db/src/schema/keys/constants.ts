export const apiKeyExpirationDate = [
  '1-day',
  '7-days',
  '30-days',
  '60-days',
  '90-days',
  '180-days',
  '1-year',
  'never'
] as const;

export type KeyExpirationDate = (typeof apiKeyExpirationDate)[number];
