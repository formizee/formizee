import type {schema} from '@formizee/db';
import {planConfig} from './config';
import type {Limits} from './types';

export type Plan = schema.WorkspacePlans;

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

export const calculatePlanCycleDates = (workspace: schema.Workspace) => {
  const startDate =
    workspace.endsAt !== null
      ? new Date(workspace.endsAt.setMonth(workspace.endsAt.getMonth() - 1))
      : new Date(
          new Date(
            workspace.createdAt.setMonth(new Date().getMonth())
          ).setFullYear(new Date().getFullYear())
        );

  const endDate =
    workspace.endsAt !== null
      ? workspace.endsAt
      : new Date(
          new Date(
            workspace.createdAt.setMonth(new Date().getMonth() + 1)
          ).setFullYear(new Date().getFullYear())
        );

  return {startDate, endDate};
};
