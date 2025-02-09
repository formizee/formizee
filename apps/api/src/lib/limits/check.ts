import {calculatePlanCycleDates, getLimits} from '@formizee/plans';
import type {Analytics} from '@formizee/analytics';
import type {Database, schema} from '@formizee/db';
import type {Vault} from '@formizee/vault';

type Result = 'ok' | '80%' | '100%';

interface Input {
  workspace: schema.Workspace;
}

interface Services {
  analytics: Analytics;
  database: Database;
  vault: Vault;
}

export const checkSubmissionPlanLimits = async (
  {workspace}: Input,
  {database, vault, analytics}: Services
): Promise<{submissions: Result; storage: Result}> => {
  let storageLimit: Result = 'ok';
  let submissionsLimit: Result = 'ok';

  const billingCycle = calculatePlanCycleDates(workspace);
  const limits = getLimits(workspace.plan);

  // Get submissions

  const response = await analytics.billing.billableSubmissions({
    startDate: Math.floor(billingCycle.startDate.getTime() / 1000),
    endDate: Math.floor(billingCycle.endDate.getTime() / 1000),
    workspaceId: workspace.id
  });

  const submissionsCount = response.err
    ? 0
    : (response.val[0]?.submissions ?? 0);

  // Get storage

  const endpoints = await database.query.endpoint.findMany({
    where: (table, {eq}) => eq(table.workspaceId, workspace.id)
  });

  let storageCount = 0;
  await Promise.all(
    endpoints.map(async endpoint => {
      const {data, error} = await vault.storage.get({
        endpointId: endpoint.id
      });

      if (error) {
        return;
      }
      storageCount += Math.round(data.storageUsed / (1024 * 1024));
    })
  );

  // Check submissions

  if (submissionsCount === Math.abs(limits.submissions * 0.8)) {
    submissionsLimit = '80%';
  }

  if (submissionsCount >= limits.submissions) {
    submissionsLimit = '100%';
  }

  // Check storage

  if (storageCount >= Math.abs(limits.storage * 0.8)) {
    storageLimit = '80%';
  }

  if (storageCount >= limits.storage) {
    storageLimit = '100%';
  }

  return Promise.resolve({
    submissions: submissionsLimit,
    storage: storageLimit
  });
};
