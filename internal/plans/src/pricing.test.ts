import {assert, describe, it, expect} from 'vitest';
import {pricingTableConfig} from './pricing';

describe('pricingTableConfig', () => {
  it('should have the correct structure', () => {
    // Test for required keys in the pricingTableConfig
    const keys = Object.keys(pricingTableConfig);
    expect(keys).toEqual(
      expect.arrayContaining(['forms', 'storage', 'collaboration', 'others'])
    );

    // Test that each key has the correct structure
    for (const key of keys) {
      const section = pricingTableConfig[key];
      if (!section) {
        /* v8 ignore next 3 */
        assert('@formizee/billing: Section is undefined');
        return;
      }

      expect(section).toHaveProperty('label');
      expect(typeof section.label).toBe('string');

      expect(section).toHaveProperty('features');
      expect(Array.isArray(section.features)).toBe(true);

      for (const feature of section.features) {
        expect(feature).toHaveProperty('value');
        expect(feature).toHaveProperty('label');
        expect(typeof feature.value).toBe('string');
        expect(typeof feature.label).toBe('string');
      }
    }
  });
});
