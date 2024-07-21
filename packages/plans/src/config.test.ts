import {describe, it, expect} from 'vitest';
import {planConfig} from './config';

// Define the expected structure for the plans
const expectedPlanKeys: Array<keyof typeof planConfig> = [
  'hobby',
  'pro',
  'enterprise'
];

describe('planConfig', () => {
  it('should have all required plans', () => {
    const planKeys = Object.keys(planConfig) as Array<keyof typeof planConfig>;
    expect(planKeys).toEqual(expectedPlanKeys);
  });

  it('should have correct structure for each plan', () => {
    for (const planKey of expectedPlanKeys) {
      const plan = planConfig[planKey];

      expect(plan).toHaveProperty('title');
      expect(['Hobby', 'Pro', 'Enterprise']).toContain(plan.title);

      expect(plan).toHaveProperty('description');
      expect(typeof plan.description).toBe('string');

      expect(plan).toHaveProperty('price');
      expect(typeof plan.price).toBe('number');
      expect(plan.price).toBeGreaterThanOrEqual(0);

      expect(plan).toHaveProperty('limits');
      expect(plan.limits).toHaveProperty('support');
      expect(['community', 'email', 'custom']).toContain(plan.limits.support);

      expect(plan.limits).toHaveProperty('endpoints');
      if (typeof plan.limits.endpoints === 'string') {
        expect(plan.limits.endpoints).toBe('unlimited');
      }
      if (typeof plan.limits.endpoints === 'number') {
        expect(plan.limits.endpoints).toBeGreaterThanOrEqual(0);
      }

      expect(plan.limits).toHaveProperty('submissions');
      expect(typeof plan.limits.submissions).toBe('number');
      expect(plan.limits.submissions).toBeGreaterThanOrEqual(0);

      expect(plan.limits).toHaveProperty('storage');
      expect(typeof plan.limits.storage).toBe('number');
      expect(plan.limits.storage).toBeGreaterThanOrEqual(0);

      expect(plan.limits).toHaveProperty('members');
      if (typeof plan.limits.members === 'string') {
        expect(plan.limits.members).toBe('unlimited');
      }
      if (typeof plan.limits.members === 'number') {
        expect(plan.limits.members).toBeGreaterThanOrEqual(1);
      }
    }
  });
});
