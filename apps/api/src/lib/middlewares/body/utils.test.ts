import {validateContentType, supportedContentTypes} from './utils';
import {describe, expect, it} from 'vitest';

describe('Validate Content-Type', () => {
  supportedContentTypes.map(contentType => {
    it(`Should pass ${contentType}`, () => {
      const res = validateContentType(contentType);
      expect(res).toStrictEqual({contentType, valid: true});
    });
  });

  it('Should not pass other formats', () => {
    const res = validateContentType('application/javascript');
    expect(res).toStrictEqual({contentType: null, valid: false});
  });
});
