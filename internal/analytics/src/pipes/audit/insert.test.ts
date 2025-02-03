import {ClickHouseContainer} from '@/testutils';
import type {AuditLog} from './schema';
import {expect, test} from 'vitest';
import {newId} from '@formizee/id';
import {Analytics} from '@/index';

test(
  'inserts a single log',
  {
    timeout: 300_000
  },
  async t => {
    const container = await ClickHouseContainer.start(t);

    const analytics = new Analytics({url: container.url()});

    const auditLog: AuditLog = {
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
        location: '',
        userAgent: ''
      }
    };

    const {err: insertErr} = await analytics.auditLogs.insert(auditLog);
    expect(insertErr).toBeUndefined();

    const latestAuditLogs = await analytics.auditLogs.perWeek({
      workspaceId: auditLog.workspaceId
    });

    expect(latestAuditLogs.err).toBeUndefined();
    expect(latestAuditLogs.val!.length).toBe(1);
    expect(latestAuditLogs.val![0]?.time).toBe(auditLog.time);
    expect(latestAuditLogs.val![0]?.event).toBe(auditLog.event);
  }
);
