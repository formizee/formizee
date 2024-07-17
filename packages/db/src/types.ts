import type {InferSelectModel} from 'drizzle-orm';
import type * as schema from './schemas';

export type ApiKey = InferSelectModel<typeof schema.apiKeys>;
export type AuthToken = InferSelectModel<typeof schema.authTokens>;
export type Email = InferSelectModel<typeof schema.emails>;
export type Endpoint = InferSelectModel<typeof schema.endpoints>;
export type Member = InferSelectModel<typeof schema.members>;
export type Submission = InferSelectModel<typeof schema.submissions>;
export type Team = InferSelectModel<typeof schema.teams>;
export type User = InferSelectModel<typeof schema.users>;
export type Waitlist = InferSelectModel<typeof schema.waitlist>;
