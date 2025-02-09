import {ClickHouseContainer} from '../../testutils';
import {Analytics} from '../../index';
import {expect, test} from 'vitest';
import {newId} from '@formizee/id';

test(
  'inserts a single log',
  {
    timeout: 300_000
  },
  async t => {
    const container = await ClickHouseContainer.start(t);

    const analytics = new Analytics({url: container.url()});

    const auditLog = {
      workspaceId: newId('workspace'),
      auditLogId: newId('auditlog'),
      event: 'workspace.create',
      time: Date.now(),
      actor: {
        id: newId('user'),
        type: 'user'
      },
      resources: [
        {
          id: newId('workspace'),
          type: 'workspace',
          name: 'Example'
        }
      ],
      context: {
        location: 'Valencia',
        userAgent: 'Arc Browser'
      }
    };

    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const {err: insertErr} = await analytics.auditLogs.insert(auditLog as any);
    expect(insertErr).toBeUndefined();

    const latestAuditLogs = await analytics.auditLogs.perWeek({
      workspaceId: auditLog.workspaceId
    });

    expect(latestAuditLogs.err).toBeUndefined();
    expect(latestAuditLogs.val!.length).toBe(1);
    expect(latestAuditLogs.val![0]?.time).toBe(auditLog.time);
    expect(latestAuditLogs.val![0]?.event).toBe(auditLog.event);
    expect(latestAuditLogs.val![0]?.actor.id).toBe(auditLog.actor.id);
    expect(latestAuditLogs.val![0]?.context.location).toBe(
      auditLog.context.location
    );
  }
);
