import {ClickHouseContainer} from '../../testutils';
import type {schema} from '../submissions/schema';
import {Analytics} from '../../index';
import {expect, test} from 'vitest';
import {newId} from '@formizee/id';
import type {z} from 'zod';

type Submission = z.infer<typeof schema>;

test(
  'get formizee stadistics',
  {
    timeout: 300_000
  },
  async t => {
    const container = await ClickHouseContainer.start(t);

    const analytics = new Analytics({url: container.url()});

    const submission: Submission = {
      workspaceId: newId('workspace'),
      endpointId: newId('endpoint'),
      uploadedAt: Date.now(),
      context: {
        location: 'example',
        userAgent: 'testing'
      }
    };

    const {err: insertErr} = await analytics.submissions.insert(submission);
    expect(insertErr).toBeUndefined();

    const stadistics = await analytics.stadistics.get({});

    expect(stadistics.val).toStrictEqual([{submissions: 1, requests: 0}]);
    expect(stadistics.err).toBeUndefined();
  }
);
