import type {BillingPlan} from '@formizee/db';
import type {Limits} from './types';

export const planConfig: Record<
  BillingPlan,
  {
    title: 'Hobby' | 'Pro' | 'Teams' | 'Company';
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
      members: 1
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
      members: 1
    }
  },
  teams: {
    title: 'Teams',
    description: 'For small teams',
    price: 20,
    limits: {
      support: 'custom',
      endpoints: 'unlimited',
      submissions: 10000,
      storage: 3000,
      members: 6
    }
  },
  company: {
    title: 'Company',
    description: 'For bigger teams',
    price: 80,
    limits: {
      support: 'custom',
      endpoints: 'unlimited',
      submissions: 100000,
      storage: 10000,
      members: 'unlimited'
    }
  }
};
