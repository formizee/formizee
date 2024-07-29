import type {schema} from '@formizee/db';
import {planConfig} from './config';
import type {Limits} from './types';

export function getLimit<T extends keyof Limits>(
  plan: schema.WorkspacePlans,
  limit: T
) {
  return planConfig[plan].limits[limit];
}

export function getLimits(plan: schema.WorkspacePlans | null) {
  return planConfig[plan || 'hobby'].limits;
}

export function getPlanConfig(plan: schema.WorkspacePlans | null) {
  return planConfig[plan || 'hobby'];
}
