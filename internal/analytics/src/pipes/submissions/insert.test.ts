import {ClickHouseContainer} from '@/testutils';
import type {schema} from './schema';
import {expect, test} from 'vitest';
import {newId} from '@formizee/id';
import {Analytics} from '@/index';
import type {z} from 'zod';

type Submission = z.infer<typeof schema>;

test(
  'inserts a single submission',
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

    const perDay = await analytics.submissions.perDay({
      endpointId: submission.endpointId
    });

    expect(perDay.err).toBeUndefined();
    expect(perDay.val!.length).toBe(1);

    const perMonth = await analytics.submissions.perMonth({
      endpointId: submission.endpointId
    });

    expect(perMonth.err).toBeUndefined();
    expect(perMonth.val!.length).toBe(1);

    const total = await analytics.submissions.perEndpoint({
      endpointId: submission.endpointId
    });

    expect(total.err).toBeUndefined();
    expect(total.val!.length).toBe(1);
  }
);
