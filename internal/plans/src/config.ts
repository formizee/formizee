import type {schema} from '@formizee/db';
import type {Limits} from './types';

export type WorkspacePlans = schema.WorkspacePlans;

export const planConfig: Record<
  schema.WorkspacePlans,
  {
    title: 'Hobby' | 'Pro' | 'Teams' | 'Enterprise' | 'community';
    description: string;
    price: number;
    limits: Limits;
  }
> = {
  hobby: {
    title: 'Hobby',
    description: 'For personal stuff',
    price: 0,
    limits: {
      support: 'community',
      endpoints: 100,
      submissions: 250,
      storage: 100,
      members: 1,
      keys: 10,
      apiDailyRequests: 1000
    }
  },
  pro: {
    title: 'Pro',
    description: 'For production projects',
    price: 5,
    limits: {
      support: 'email',
      endpoints: 1000,
      submissions: 1000,
      storage: 1000,
      members: 1,
      keys: 100,
      apiDailyRequests: 100000
    }
  },
  teams: {
    title: 'Teams',
    description: 'For startups and teams',
    price: 20,
    limits: {
      support: 'custom',
      endpoints: 10000,
      submissions: 10000,
      storage: 10000,
      members: 10,
      keys: 1000,
      apiDailyRequests: 1000000
    }
  },
  enterprise: {
    title: 'Enterprise',
    description: 'For bigger teams',
    price: 80,
    limits: {
      support: 'custom',
      endpoints: 'unlimited',
      submissions: 100000,
      storage: 10000,
      members: 'unlimited',
      keys: 'unlimited',
      apiDailyRequests: 'unlimited'
    }
  },
  community: {
    title: 'community',
    description: 'The Self-Hosted Version',
    price: 0,
    limits: {
      support: 'community',
      endpoints: 'unlimited',
      submissions: Number.POSITIVE_INFINITY,
      storage: Number.POSITIVE_INFINITY,
      members: 'unlimited',
      keys: 'unlimited',
      apiDailyRequests: 'unlimited'
    }
  }
};
