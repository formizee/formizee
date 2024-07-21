export const workspacePlans = ['hobby', 'pro', 'enterprise'] as const;
export type WorkspacePlans = (typeof workspacePlans)[number];

export const workspaceRole = ['owner', 'admin', 'member'] as const;
export type WorkspaceRole = (typeof workspaceRole)[number];

export const workspacePlanHierarchy: Record<
  (typeof workspacePlans)[number],
  number
> = {
  hobby: 0,
  pro: 1,
  enterprise: 2
};
