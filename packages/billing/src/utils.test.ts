import {getLimit, getLimits, getPlanConfig} from './utils';
import {describe, it, expect} from 'vitest';
import {planConfig} from './config';
import type {Limits} from './types';

describe('Utility functions', () => {
  it('getLimit should return the correct limit for a given plan and limit key', () => {
    // Iterate over each plan and check all limit keys
    for (const planKey of Object.keys(planConfig) as Array<
      keyof typeof planConfig
    >) {
      const planLimits = planConfig[planKey].limits;
      for (const limitKey of Object.keys(planLimits) as Array<keyof Limits>) {
        expect(getLimit(planKey, limitKey)).toBe(planLimits[limitKey]);
      }
    }
  });

  it('getLimits should return the limits for the specified plan or default to "hobby"', () => {
    // Test with specific plans
    for (const planKey of Object.keys(planConfig) as Array<
      keyof typeof planConfig
    >) {
      expect(getLimits(planKey)).toEqual(planConfig[planKey].limits);
    }

    // Test with null input
    expect(getLimits(null)).toEqual(planConfig.hobby.limits);
  });

  it('getPlanConfig should return the correct plan configuration or default to "hobby"', () => {
    // Test with specific plans
    for (const planKey of Object.keys(planConfig) as Array<
      keyof typeof planConfig
    >) {
      expect(getPlanConfig(planKey)).toEqual(planConfig[planKey]);
    }

    // Test with null input
    expect(getPlanConfig(null)).toEqual(planConfig.hobby);
  });
});
