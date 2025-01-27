export const workspacePlans = [
  'hobby',
  'pro',
  'teams',
  'enterprise',
  'community'
] as const;
export type WorkspacePlans = (typeof workspacePlans)[number];

export const workspaceRole = ['owner', 'admin', 'member'] as const;
export type WorkspaceRole = (typeof workspaceRole)[number];

export const workspacePlanHierarchy: Record<
  (typeof workspacePlans)[number],
  number
> = {
  hobby: 0,
  pro: 1,
  teams: 2,
  enterprise: 3,
  community: 4
};
