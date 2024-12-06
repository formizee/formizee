export const memberPermissions = ['read', 'edit', 'create', 'all'] as const;
export type MemberPermissions = (typeof memberPermissions)[number];
