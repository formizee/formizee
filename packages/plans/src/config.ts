import type {WorkspacePlans} from '@formizee/db/schema';
import type {Limits} from './types';
export type {WorkspacePlans};

export const planConfig: Record<
  WorkspacePlans,
  {
    title: 'Hobby' | 'Pro' | 'Teams' | 'Enterprise';
    description: string;
    price: number;
    limits: Limits;
  }
> = {
  hobby: {
    title: 'Hobby',
    description: 'For personal projects',
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
    description: 'For small projects',
    price: 5,
    limits: {
      support: 'email',
      endpoints: 'unlimited',
      submissions: 1000,
      storage: 1000,
      members: 1,
      keys: 10,
      apiDailyRequests: 'unlimited'
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
  }
};
