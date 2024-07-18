import type {BillingPlan} from '@formizee/db';
import {planConfig} from './config';
import type {Limits} from './types';

export function getLimit<T extends keyof Limits>(plan: BillingPlan, limit: T) {
  return planConfig[plan].limits[limit];
}

export function getLimits(plan: BillingPlan | null) {
  return planConfig[plan || 'hobby'].limits;
}

export function getPlanConfig(plan: BillingPlan | null) {
  return planConfig[plan || 'hobby'];
}
