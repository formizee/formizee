import type {InferSelectModel} from 'drizzle-orm';
import type * as schema from './schemas';

// Teams
export type BillingPlan = (typeof schema.billingPlans.enumValues)[number];
export type Member = InferSelectModel<typeof schema.members>;
export type Team = InferSelectModel<typeof schema.teams>;

// API Keys
export type ApiKey = Omit<InferSelectModel<typeof schema.apiKeys>, 'key'>;
export type ApiKeyScopes = (typeof schema.apiKeyScopes.enumValues)[number];
export type ApiKeyExpirationDate =
  (typeof schema.apiKeyExpirationDate.enumValues)[number];

// Endpoints
export type Endpoint = InferSelectModel<typeof schema.endpoints>;
export type EndpointIcon = (typeof schema.icons.enumValues)[number];
export type EndpointColor = (typeof schema.colors.enumValues)[number];

// Users
export type User = Omit<InferSelectModel<typeof schema.users>, 'password'>;
export type AuthToken = InferSelectModel<typeof schema.authTokens>;
export type Email = InferSelectModel<typeof schema.emails>;

// Submissions
export type Submission = InferSelectModel<typeof schema.submissions>;

// Waitlist
export type Waitlist = InferSelectModel<typeof schema.waitlist>;
