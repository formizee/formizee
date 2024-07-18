import type {InferSelectModel} from 'drizzle-orm';
import type * as schema from './schemas';

export type BillingPlan = (typeof schema.billingPlans.enumValues)[number];

export type ApiKey = Omit<InferSelectModel<typeof schema.apiKeys>, 'key'>;
export type AuthToken = InferSelectModel<typeof schema.authTokens>;
export type Email = InferSelectModel<typeof schema.emails>;
export type Endpoint = InferSelectModel<typeof schema.endpoints>;
export type Member = InferSelectModel<typeof schema.members>;
export type Submission = InferSelectModel<typeof schema.submissions>;
export type Team = InferSelectModel<typeof schema.teams>;
export type User = Omit<InferSelectModel<typeof schema.users>, 'password'>;
export type Waitlist = InferSelectModel<typeof schema.waitlist>;
